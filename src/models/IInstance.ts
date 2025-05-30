export interface IInstance {
  id: string;
  name: string;
  token?: string;
  expiration?: string;
  apiType: ApiTypes;
  fields: Record<string, { definition: IFieldDefinition; value: any }>;
  isActive: boolean;
  product: ProductTypes;
  apiDefinitionId?: string;
}

export interface IFieldDefinition {
  name: string;
  label: string;
  type: FieldTypes;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  distinct?: boolean;
  description?: string;
  placeholder?: string;
}

export interface IApiDefinition {
  id: string;
  name: string;
  label: string;
  fields: IFieldDefinition[];
  apiType: ApiTypes;
  product: ProductTypes;
}

export enum ApiTypes {
  Authoring = 'Authoring',
  Content = 'Edge/Content Delivery',
  PersonalizeREST = 'Personalize REST APIs',
}

export enum FieldTypes {
  Text = 'Text',
  Select = 'Select',
}

export enum ProductTypes {
  XMC = 'Sitecore XM Cloud',
  XP = 'Sitecore XP/XM',
  Experience = 'Sitecore CDP/Personalize',
}
