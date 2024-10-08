import { ClientData } from '@/context/ClientContext';
import { createPersonalizationExperience } from '@/services/Personalize.service';
import { tool } from 'ai';
import { z } from 'zod';

export const CreateExperienceTool = (clients: ClientData[]) => {
  return tool({
    description: 'Creates a new personalization experience in Sitecore Personalize.',
    parameters: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
    }),
    execute: async ({ name }) => {
      await createPersonalizationExperience(name, clients);
    },
  });
};
