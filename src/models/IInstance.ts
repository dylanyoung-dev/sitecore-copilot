export interface IInstance {
  id: string;
  name: string;
  endpoint: string;
  configuration: Record<string, string>;
  apiRoutes: IApiRoutes;
  token: string;
  expiration: string;
  isDefault: boolean;
}

export interface IApiRoutes {
  id: string;
  product: Products;
  fields: IFieldConfiguration[];
  environment: Environments;
}

export interface IFieldConfiguration {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export enum Products {
  XpXm = 'XP/XM',
  XMCloud = 'XM Cloud',
  CDPPersonalize = 'CDP/Personalize',
}

export enum Environments {
  Qa = 'QA',
  Prod = 'Prod',
  Dev = 'Dev',
  Staging = 'Staging',
  Local = 'Local',
  Uat = 'UAT',
}
