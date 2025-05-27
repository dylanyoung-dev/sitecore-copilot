import { ApiTypes, FieldTypes, IApiDefinition, ProductTypes } from '@/models/IInstance';

export const getApiDefinitions = (): IApiDefinition[] => {
  if (typeof window === 'undefined') {
    return []; // Return an empty array during SSR
  }

  const featureFlags = window.sessionStorage.getItem('featureFlags');
  const flags = featureFlags ? JSON.parse(featureFlags) : {};

  return [
    {
      name: 'personalize',
      label: 'Sitecore Experience (CDP/P)',
      fields: [
        {
          name: 'environment',
          label: 'Environment',
          type: FieldTypes.Select,
          required: true,
          options: ['Nonprod', 'Production'],
          distinct: true,
          description:
            'Sitecore Personalize environments come with two default environments, either the nonprod or production.',
        },
        {
          name: 'region',
          label: 'Region',
          type: FieldTypes.Select,
          required: true,
          options: ['APJ', 'EU', 'US'],
          distinct: true,
        },
        {
          name: 'clientId',
          label: 'API Key',
          type: FieldTypes.Text,
          required: true,
        },
        {
          name: 'clientSecret',
          label: 'API Secret',
          type: FieldTypes.Text,
          required: true,
        },
      ],
      apiType: ApiTypes.PersonalizeREST,
      product: ProductTypes.Experience,
    },
    {
      name: 'xmc-admin',
      label: 'Authoring/Management APIs',
      fields: [
        {
          name: 'clientId',
          label: 'Client ID',
          type: FieldTypes.Text,
          required: true,
        },
        {
          name: 'clientSecret',
          label: 'Client Secret',
          type: FieldTypes.Text,
          required: true,
        },
      ],
      apiType: ApiTypes.Authoring,
      product: ProductTypes.XMC,
    },
    {
      name: 'xmc-edge',
      label: 'Edge/Content Delivery',
      fields: [
        {
          name: 'token',
          label: 'edgeToken',
          type: FieldTypes.Text,
          required: true,
        },
        {
          name: 'edgeInstance',
          label: 'Edge Instance',
          type: FieldTypes.Select,
          required: true,
          options: ['Preview', 'Live/Production'],
        },
      ],
      apiType: ApiTypes.Content,
      product: ProductTypes.XMC,
    },
  ];
};
