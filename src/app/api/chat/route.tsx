import { ClientData } from '@/context/ClientContext';
import { CreateExperienceTool } from '@/tools/Sitecore';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages } from 'ai';
import { streamUI } from 'ai/rsc';
import { NextRequest, NextResponse } from 'next/server';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  messages: Message[];
  clients: ClientData[];
}

export const maxDuration = 30;

export async function POST(req: NextRequest, res: NextResponse) {
  const { messages, clients } = await req.json();

  const result = await streamUI({
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    text: ({ content }) => <div>{content}</div>,
    tools: { createExperience: CreateExperienceTool(clients) },
  });

  return NextResponse.json(result);
}

// export async function POST(req: NextRequest) {
//   try {
//     const { message, messages, clients }: ChatRequest = await req.json();

//     const combinedMessages: ChatCompletionMessageParam[] = [
//       {
//         role: 'system',
//         content:
//           'You are the Sitecore Assistant which will help users create Sitecore assets in the Sitecore SaaS products.  When running Sitecore Personalize apis that require code, always use EcmaScript 5.0 javascript that would work with Server Side Nashorn Javascript Engine.',
//       },
//       ...messages.map((msg) => ({
//         role: msg.sender,
//         content: msg.content,
//       })),
//       { role: 'user', content: message },
//     ];

//     console.log({ clients });

//     const runner = await client.beta.chat.completions
//       .runTools({
//         model: 'gpt-4o-mini',
//         messages: combinedMessages,
//         tools: [await CreateExperienceTool(clients), await GetFlowsTool(clients), await ListOfExperiencesTool(clients)],
//       })
//       .on('message', (message) => {
//         console.log(message);
//       })
//       .on('functionCallResult', (result) => {
//         console.log('result', result);
//       });

//     const finalContent = await runner.finalContent();

//     return NextResponse.json({ message: finalContent });
//   } catch (error) {
//     console.error('Error generating AI Response:', error);
//     return NextResponse.json({ error: 'Error generating AI Response' }, { status: 500 });
//   }
// }
