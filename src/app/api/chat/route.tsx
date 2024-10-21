import { ClientData } from '@/context/ClientContext';
import { PreviewExperienceTool } from '@/tools/Sitecore/Personalize';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, Message, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  messages: Array<Message>;
  clients: ClientData[];
}

export const maxDuration = 30;

const productMapping = {
  experience: 'Sitecore Personalize',
  // Add other mappings as needed
};

export async function POST(req: NextRequest, res: NextResponse) {
  const { messages, clients }: ChatRequest = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    maxSteps: 10,
    messages: convertToCoreMessages(messages),
    tools: {
      // createPersonalizeExperience: CreateExperienceTool(clients),
      previewPersonalizeExperience: PreviewExperienceTool(clients),
    },
    system: `\
      You are a friendly Sitecore Assistant that helps users create and manage Sitecore assets.

      - ask follow up questions to nudge user into the optimal flow

      Creating Assets has the following Flow:
      - Determine the Sitecore Product the user wants to work with.
      - Provide a Preview of what the user wants to create. Any Html, CSS, JS should be suggested by the system, based on the general description of the needs.
      - Provide confirmation of the assets and then create them.

      Mapping of user intents to Sitecore Products:
      ${Object.entries(productMapping)
        .map(([key, value]) => `- "${key}" refers to "${value}"`)
        .join('\n')}
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
