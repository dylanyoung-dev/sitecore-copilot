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
}
