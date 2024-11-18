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
    messages: convertToCoreMessages(messages),
    tools: {
      // createPersonalizeExperience: CreateExperienceTool(clients),
      previewPersonalizeExperience: PreviewExperienceTool(clients),
    },
    system: `\
      You are a friendly Sitecore Assistant that helps users create experiences in Sitecore Personalize.

      - ask follow up questions to nudge user into the optimal flow

      Creating an Experience has the following Flow:
      - Determine details about the Experience and create HTML, CSS, JS assets to allow the user to preview the Personalize Experience.
      - Allow the user to make modifications to the experience details to improve the experience.
      - Finally confirm the creation of the experience.
      - Create the Experience in Sitecore Personalize.
    `,
  });

  console.log(JSON.stringify(result, null, 2));

  return result.toDataStreamResponse();
}

// Add LangGraph to add multi-agent flows for Sitecore CDP, XMC, etc. (V3)
// Add a tool that can create a new experience in Sitecore Personalize (V2)
// Add a tool to allow a user to add or create a decision model in Sitecore Personalize (V2) - But only once they have started a flow to create an experience
// Add a tool to allow them to select from existing recipes (a feature coming soon) in order to create custom recipes (V3)

/*
Possible Flow of Sitecore Personalize Experience Creation Agent:

1. User asks to create a new experience
  - This step could be added to determine if they want to use a recipe, create a new experience from scratch or use an existing template
2. Define Base Experience Details include Name and Assets like Html, CSS, JS and Freemarker API Request
  - Template Vars could be added Later
  - Step could be iterative to allow user to make modifications to the experience details to improve the experience
3. (Optional) Allow user to add or create a decision model
4. (Optional) Allow user to pick an Audience
5. Review and Confirm the creation of the Experience
6. Create the Experience in Sitecore Personalize

*/
