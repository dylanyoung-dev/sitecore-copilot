import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { createPersonalizationExperience } from '@/services/Personalize.service';
import { z } from 'zod';

const experienceAISchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.enum(['Web', 'API', 'Triggered']),
  channels: z
    .array(z.enum(['Call Center', 'Email', 'Mobile App', 'Mobile Web', 'Web', 'SMS']))
    .min(1, { message: 'At least one channel is required' }),
});

export const CreateExperienceTool = async (clients: ClientData[]) => ({
  type: 'function' as const,
  product: ProductOptions.PersonalizeCDP,
  function: {
    name: 'create_personalization_experience',
    type: 'function',
    description: 'Creates a new personalization experience in Sitecore Personalize.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the personalization experience.',
        },
        type: {
          type: 'string',
          enum: ['Web', 'API', 'Triggered'],
          description: 'The type of the experience.',
        },
        channels: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['Call Center', 'Email', 'Mobile App', 'Mobile Web', 'Web', 'SMS'],
          },
          description: 'The channels for the experience.',
        },
      },
      required: ['name', 'type', 'channels'],
    },
    function: async (args: { params: any }, runner: any) => {
      return await createPersonalizationExperience(args, clients);
    },
    parse: JSON.parse,
  },
});
