export interface IMcpServer {
  id: string;
  name: string;
  url: string;
  security: 'open' | 'oauth';
  description?: string;
  isActive: boolean;
  type: 'http' | 'sse';
  token?: string;
  tools?: string[];
  headers?: HeaderConfig[];
}

export interface HeaderConfig {
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
