import { ClientData } from '@/context/ClientContext';
import { CreateExperienceTool, GetFlowsTool, ListOfExperiencesTool } from '@/tools/Sitecore';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const client = new OpenAI({ apiKey: process.env.OpenAI_API_KEY });

interface Message {
  sender: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  messages: Message[];
  clients: ClientData[];
}

export async function POST(req: NextRequest) {
  try {
    const { message, messages, clients }: ChatRequest = await req.json();

    const combinedMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'You are the Sitecore Assistant which will help users create Sitecore assets in the Sitecore SaaS products.  When running Sitecore Personalize apis that require code, always use EcmaScript 5.0 javascript that would work with Server Side Nashorn Javascript Engine.',
      },
      ...messages.map((msg) => ({
        role: msg.sender,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    console.log({ clients });

    const runner = await client.beta.chat.completions
      .runTools({
        model: 'gpt-4o-mini',
        messages: combinedMessages,
        tools: [await CreateExperienceTool(clients), await GetFlowsTool(clients), await ListOfExperiencesTool(clients)],
      })
      .on('message', (message) => {
        console.log(message);
      });

    const finalContent = await runner.finalContent();

    return NextResponse.json({ message: finalContent });
  } catch (error) {
    console.error('Error generating AI Response:', error);
    return NextResponse.json({ error: 'Error generating AI Response' }, { status: 500 });
  }
}
