export interface IHeaderConfig {
  key: string;
  value: string;
  required: boolean;

  source?: {
    type: 'token' | 'instance' | 'manual';
    id?: string; // ID of the token or instance
    field?: string; // Field to use from the source
    instanceFilter?: string;
    provider?: string;
  };
}
