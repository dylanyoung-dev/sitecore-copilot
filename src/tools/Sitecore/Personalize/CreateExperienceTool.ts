import { ClientData } from '@/context/ClientContext';
import { openai } from '@ai-sdk/openai';
import { generateObject, tool } from 'ai';
import { z } from 'zod';

// export const CreateExperienceTool = (clients: ClientData[]) => {
//   return tool({
//     description: 'Creates a new experience in the Product Sitecore Personalize.',
//     parameters: z.object({
//       name: z.string().min(1, { message: 'Name is required' }),
//       assets: z.object({
//         html: z.string().min(1, { message: 'HTML is required' }),
//         css: z.string().min(1, { message: 'CSS is required' }),
//         js: z.string().min(1, { message: 'JS is required' }),
//       }),
//     }),
//     execute: async ({ name }) => {
//       let result = await createPersonalizationExperience(name, clients);

//       return result;
//     },
//   });
// };

// Could create a multi agent that handles Sitecore Personalize or CDP or XMC, using multi-agent using a tool like lang graph

export const PreviewExperienceTool = (clients: ClientData[]) => {
  return tool({
    description: 'Preview a new Experience, where the system should suggest the assets based on the inputs.',
    parameters: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      description: z.string().min(1, { message: 'Description is required' }),
    }),
    execute: async ({ name, description }) => {
      const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: z.object({
          assets: z.object({
            html: z.string(),
            css: z.string(),
            js: z.string(),
          }),
          //templateVars: z.record(z.string(), z.string()),
        }),
        prompt: `\
          Generate HTML, CSS, and JavaScript for the following experience description:
          "${description}"

          ** Important Instructions **:
          - All JavaScript must use EcmaScript 5 syntax that works with lashorn server side java engine.
          - If the user asks for fields, fill those fields by default with ipsum lorem text, unless they specify otherwise.
        `,
      });

      return object;
    },
  });
};
