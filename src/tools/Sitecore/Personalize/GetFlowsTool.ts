import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { getFlows } from '@/services/Personalize.service';

export const GetFlowsTool = async (clients: ClientData[]) => ({
  type: 'function' as const,
  product: ProductOptions.PersonalizeCDP,
  function: {
    name: 'get_experience_experiment_definition',
    type: 'function',
    description:
      'Gets the definition of a personalization experience or experiment in Sitecore Personalize.',
    parameters: {
      type: 'object',
      properties: {
        ref: {
          type: 'string',
          description:
            'The reference (or Unique Identifier - Typically a Guid) of the personalization experience or experiment.',
        },
      },
      required: ['ref'],
    },
    function: async (args: { params: any }, runner: any) => {
      await getFlows(args, clients);
    },
    parse: JSON.parse,
  },
});
