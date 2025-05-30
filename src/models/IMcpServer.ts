import { IHeaderConfig } from './IHeaderConfig';

export interface IMcpServer {
  id: string;
  name: string;
  url: string;
  apiDefinitionId: string;
  security: 'open' | 'oauth';
  description?: string;
  isActive: boolean;
  type: 'http' | 'sse';
  token?: string;
  tools?: string[];
  category?: string;
  tags?: string[];
  headers?: IHeaderConfig[];
}
