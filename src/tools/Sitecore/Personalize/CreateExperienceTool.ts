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
        }),
        prompt: `\
          Generate HTML, CSS, and JavaScript for the following experience description:
          "${description}"

          All JavaScript must use EcmaScript 5 syntax that works with lashorn server side java engine.
        `,
      });

      return object;
    },
  });
};
