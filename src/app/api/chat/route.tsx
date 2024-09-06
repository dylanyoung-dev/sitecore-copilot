import { PersonalizeTool } from '@/tools/Sitecore/Personalize';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const client = new OpenAI({ apiKey: process.env.OpenAI_API_KEY });

interface Message {
  sender: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, messages }: { message: string; messages: Message[] } =
      await req.json();

    const combinedMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'You are the Sitecore Assistant which will help users create Sitecore assets in the Sitecore SaaS products.',
      },
      ...messages.map((msg) => ({
        role: msg.sender,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const runner = await client.beta.chat.completions
      .runTools({
        model: 'gpt-4o-mini',
        messages: combinedMessages,
        tools: [PersonalizeTool],
      })
      .on('message', (message) => {
        console.log(message);
      });

    const finalContent = await runner.finalContent();

    return NextResponse.json({ message: finalContent });
  } catch (error) {
    console.error('Error generating AI Response:', error);
    return NextResponse.json(
      { error: 'Error generating AI Response' },
      { status: 500 }
    );
  }
}
