export interface IHeaderSource {
  type: 'manual' | 'apiDefinition';
  fieldId?: string; // Used for apiDefinition to store field name/id
}

export interface IHeaderConfig {
  key: string;
  value: string;
  required?: boolean;
  source?: IHeaderSource;
}
