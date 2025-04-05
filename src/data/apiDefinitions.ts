import { ApiTypes, Environments, FieldTypes, IApiDefinition, ProductTypes } from '@/models/IInstance';

export const apiDefinitions: IApiDefinition[] = [
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
  {
    name: 'xp',
    label: 'XP/XM',
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: FieldTypes.Text,
        required: true,
      },
      {
        name: 'password',
        label: 'Password',
        type: FieldTypes.Text,
        required: true,
      },
      {
        name: 'environment',
        label: 'Environment',
        type: FieldTypes.Select,
        required: true,
        options: Object.values(Environments),
      },
    ],
    apiType: ApiTypes.Content,
    product: ProductTypes.XP,
  },
];
