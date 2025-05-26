export interface IYamlServerConfig {
  label: string;
  name: string;
  url: string;
  type: 'http' | 'sse';
  security: 'open' | 'oauth';
  disabled?: boolean;
  docUrl?: string;
  description: string;
  requiresHeaders?: boolean;
  headers?: HeaderConfig[];
  category?: string;
  tags?: string[];
}

export interface IYamlMcpConfig {
  servers: IYamlServerConfig[];
}