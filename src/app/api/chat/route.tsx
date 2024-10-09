import { ClientData } from '@/context/ClientContext';
import { CreateExperienceTool, GenerateExperienceTool } from '@/tools/Sitecore/Personalize';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
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

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    maxSteps: 10,
    messages: convertToCoreMessages(messages),
    tools: { createExperience: CreateExperienceTool(clients), generateExperience: GenerateExperienceTool() },
    system: `\
      You are a friendly Sitecore Assistant that helps users create Sitecore assets.

      1. Before saving/creating an experience, you'll work to define the variant assets.
      2. You'll get the required details and then create the experience.
      \
    `,
  });

  console.log(JSON.stringify(result, null, 2));

  return result.toDataStreamResponse();
}

// Here's the typical flow:
// 1. Determine the **Sitecore Product** the user wants to work with.
// 2. Suggestions on the inputs for the required products and the steps to create them
// 3. Provide an interface that is AI generated to help the user create the assets
// 4. Confirm the assets are correct and then create them.
