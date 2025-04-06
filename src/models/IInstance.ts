export interface IInstance {
  id: string;
  name: string;
  endpoint: string;
  token?: string;
  expiration?: string;
  apiType: ApiTypes;
  fields: Record<string, { definition: IFieldDefinition; value: any }>;
  isActive: boolean;
  environment: Environments;
  product: ProductTypes;
}

export interface IFieldDefinition {
  name: string;
  label: string;
  type: FieldTypes;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface IApiDefinition {
  name: string;
  label: string;
  fields: IFieldDefinition[];
  apiType: ApiTypes;
  product: ProductTypes;
}

export enum ApiTypes {
  Authoring = 'Authoring',
  Content = 'Edge/Content Delivery',
  Experience = 'Experience',
}

export enum FieldTypes {
  Text = 'Text',
  Select = 'Select',
}

export enum ProductTypes {
  XMC = 'XM Cloud',
  XP = 'XP/XM',
  Experience = 'CDP/P',
}

export enum Environments {
  Local = 'Local',
  Dev = 'Development',
  Staging = 'Staging',
  QA = 'QA',
  Production = 'Production',
}
