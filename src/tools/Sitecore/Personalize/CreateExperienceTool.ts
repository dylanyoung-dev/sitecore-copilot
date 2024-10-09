import { ClientData } from '@/context/ClientContext';
import { createPersonalizationExperience } from '@/services/Personalize.service';
import { tool } from 'ai';
import { z } from 'zod';

export const GenerateExperienceTool = () => {
  return tool({
    description:
      'Generates a new personalization experience with assets (html, css, javascript, freemarker) in Sitecore Personalize.',
    parameters: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      assets: z.object({
        html: z.string().min(1, { message: 'HTML is required' }),
        css: z.string(),
        js: z.string(),
      }),
    }),
    execute: async ({ assets }) => {
      return {
        assets: assets,
        name,
      };
    },
  });
};

export const CreateExperienceTool = (clients: ClientData[]) => {
  return tool({
    description: 'Creates a new personalization experience in Sitecore Personalize.',
    parameters: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      assets: z.object({
        html: z.string().min(1, { message: 'HTML is required' }),
        css: z.string(),
        js: z.string(),
      }),
    }),
    execute: async ({ name }) => {
      await createPersonalizationExperience(name, clients);
    },
  });
};
