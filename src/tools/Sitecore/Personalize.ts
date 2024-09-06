import { CreateExperienceSchema } from 'sitecore-personalize-tenant-sdk';

const jsonSchema = CreateExperienceSchema;

export const PersonalizeExperienceCreateTool = {
  type: 'function' as const,
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
        friendlyId: {
          type: 'string',
          description:
            'A friendly identifier for the experience that can be generated from the name, using a regex pattern of ^[a-z0-9_]*$.',
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
    function: createPersonalizationExperience,
    parse: JSON.parse,
  },
};

export const PersonalizeListofExperiences = {
  type: 'function' as const,
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

async function createPersonalizationExperience(args: { params: any }) {
  console.log('Creating personalization experience:', args.params);
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
