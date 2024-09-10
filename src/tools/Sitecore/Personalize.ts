import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { CreateExperienceSchema } from 'sitecore-personalize-tenant-sdk';

const jsonSchema = CreateExperienceSchema;

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
    function: (args: { params: any }) =>
      createPersonalizationExperience(args, clients),
    parse: JSON.parse,
  },
});

export const PersonalizeListofExperiences = {
  type: 'function' as const,
  product: ProductOptions.PersonalizeCDP,
  function: {
    name: 'list_personalization_experiences_experiments',
    type: 'function',
    description:
      'Get back a list of Experiences or Experiments depending on the type of flow you would like to see',
    parameters: {
      type: 'object',
      properties: {
        ref: {
          type: 'string',
          description:
            'You can optionally pass a reference or just get a full list',
        },
      },
    },
    function: getFlows,
    parse: JSON.parse,
  },
};

async function createPersonalizationExperience(
  args: { params: any },
  clients: ClientData[]
) {
  console.log('Creating personalization experience:', args.params);
  console.log('Creating personalization experience:', clients);

  // const personalizeClient = new Client({
  //   clientId: 'your-client-id',
  //   clientSecret: 'your'
  // });

  // const experience: IFlowDefinition = {
  //   name,
  //   friendlyId,
  //   type,
  //   channels,
  // };

  let response = await console.log(
    'Creating personalization experience:',
    args.params
  );
  return {
    status: 'success',
    message: 'Personalization experience created successfully.',
  };
}

async function getFlows(args: { params: any }) {
  console.log('here is a list for {dfkdfjlk}');
  return {
    status: 'success',
    experiences: [
      {
        name: 'Experience 1',
        friendlyId: 'experience_1',
      },
    ],
  };
}
