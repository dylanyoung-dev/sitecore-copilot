import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import {
  Client,
  FlowChannel,
  FlowScheduleType,
  FlowStatus,
  FlowType,
  IClientInitOptions,
  IFlowDefinition,
  RegionOptions,
} from 'sitecore-personalize-tenant-sdk';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const experienceAISchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.enum(['Web', 'API', 'Triggered']),
  channels: z
    .array(
      z.enum(['Call Center', 'Email', 'Mobile App', 'Mobile Web', 'Web', 'SMS'])
    )
    .min(1, { message: 'At least one channel is required' }),
});

const experienceJSONSchema = zodToJsonSchema(experienceAISchema);

export const PersonalizeExperienceCreateTool = (clients: ClientData[]) => ({
  type: 'function' as const,
  product: ProductOptions.PersonalizeCDP,
  function: {
    name: 'create_personalization_experience',
    type: 'function',
    description:
      'Creates a new personalization experience in Sitecore Personalize.',
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
            enum: [
              'Call Center',
              'Email',
              'Mobile App',
              'Mobile Web',
              'Web',
              'SMS',
            ],
          },
          description: 'The channels for the experience.',
        },
      },
      required: ['name', 'type', 'channels'],
    },
    function: async (args: { params: any }, runner: any) => {
      createPersonalizationExperience(args, clients);
    },
    parse: JSON.parse,
  },
});

export const PersonalizeListofExperiencesTool = (clients: ClientData[]) => ({
  type: 'function' as const,
  product: ProductOptions.PersonalizeCDP,
  function: {
    name: 'list_personalization_experiences',
    type: 'function',
    description:
      'Lists all personalization experiences in Sitecore Personalize.',
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
      },
      required: ['name', 'type', 'channels'],
    },
    function: async (args: { params: any }, runner: any) => {
      createPersonalizationExperience(args, clients);
    },
    parse: JSON.parse,
  },
});

export const PersonalizeGetFlowsTool = (clients: ClientData[]) => ({
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
      getFlows(args, clients);
    },
    parse: JSON.parse,
  },
});

async function createPersonalizationExperience(
  args: any,
  clients: ClientData[]
) {
  let personalizeClient;
  if (args !== undefined && clients !== undefined) {
    const clientDetails = clients.find(
      (client) => (client.product = ProductOptions.PersonalizeCDP)
    );

    if (!clientDetails) {
      return {
        status: 'error',
        message:
          'You must have a client configured for Personalize/CDP to create an experience.',
      };
    }

    // TODO: Need to add support for multiple regions and what if there are multiple clients for Personalize configured.  Maybe that's where AI could help choose the right client.
    // TODO: Add "Environment" field to the client so you can configure UAT, Prod etc. for Migration scenario
    personalizeClient = new Client({
      clientId: clientDetails.clientId,
      clientSecret: clientDetails.clientSecret,
      region: RegionOptions.EU,
    } as IClientInitOptions);
    const flowTypeMapping = mapFlowType(args.type);

    console.log(args);

    if (!flowTypeMapping) {
      console.log(flowTypeMapping);
      return {
        status: 'error',
        message: `Invalid flow type: ${args.type} it should match one of the following: Web, API, Triggered`,
      };
    }

    const experience: IFlowDefinition = {
      name: args.name,
      friendlyId: args.name.toLowerCase().replace(/\s+/g, '_'),
      type: flowTypeMapping,
      channels: args.channels.map(
        (channel: string) => FlowChannel[channel as keyof typeof FlowChannel]
      ),
      status: FlowStatus.Draft,
      schedule: {
        type: FlowScheduleType.Simple,
        startDate: new Date().toISOString(),
      },
    };

    try {
      console.log('Creating personalization experience:', experience);
      let response = await personalizeClient.Flows.CreateExperience(experience);

      return {
        status: 'success',
        message: 'Personalization experience created successfully.',
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to create personalization experience: ${error.message}`,
      };
    }
  }

  let response = await console.log(
    'Creating personalization experience:',
    args.params
  );
  return {
    status: 'fail',
    message:
      'Parameters are missing for creating a personalization experience.',
  };
}

const mapFlowType = (type: string): FlowType | undefined => {
  let response: FlowType | undefined;
  switch (type) {
    case 'Web':
      response = FlowType.WebFlow;
      break;
    case 'API':
      response = FlowType.ApiFlow;
      break;
    case 'Triggered':
      response = FlowType.Triggered;
      break;
    default:
      response = undefined;
  }

  return response;
};

async function getFlows(args: any, clients: ClientData[]) {
  let personalizeClient;
  if (args !== undefined && clients !== undefined) {
    const clientDetails = clients.find(
      (client) => (client.product = ProductOptions.PersonalizeCDP)
    );

    if (!clientDetails) {
      return {
        status: 'error',
        message:
          'You must have a client configured for Personalize/CDP to create an experience.',
      };
    }

    personalizeClient = new Client({
      clientId: clientDetails.clientId,
      clientSecret: clientDetails.clientSecret,
      region: RegionOptions.EU,
    } as IClientInitOptions);

    console.log(args);

    try {
      let response = await personalizeClient.Flows.GetByRef(args.ref);

      console.log('Getting Flow Definition:', response);

      return {
        status: 'success',
        message: 'Found your experience or experiment successfully.',
        data: response,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to create personalization experience: ${error.message}`,
      };
    }
  }
}
