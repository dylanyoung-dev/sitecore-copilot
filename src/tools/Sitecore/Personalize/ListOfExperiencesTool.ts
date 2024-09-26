import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { listPersonalizationExperiences } from '@/services/Personalize.service';

export const ListOfExperiencesTool = async (clients: ClientData[]) => {
  return {
    type: 'function' as const,
    product: ProductOptions.PersonalizeCDP,
    function: {
      name: 'list_personalization_experiences',
      type: 'function',
      description: 'Lists all personalization experiences in Sitecore Personalize.',
      parameters: {
        type: 'object',
        properties: {},
        required: ['name', 'type', 'channels'],
      },
      function: async (args: { params: any }, runner: any) => {
        return await listPersonalizationExperiences(args, clients);
      },
      parse: JSON.parse,
    },
  };
};
