export interface YamlServerConfig {
  label: string;
  name: string;
  url: string;
  type: 'http' | 'sse';
  security: 'open' | 'oauth';
  disabled?: boolean;
  docUrl?: string;
  description: string;
  requiresHeaders?: boolean;
}

export interface YamlMcpConfig {
  servers: YamlServerConfig[];
}

/**
 * Client-side function to load MCP server configurations
 * This uses fetch to get the configuration from the API
 *
 * @returns Promise resolving to YamlMcpConfig object
 */
export const loadMcpServersConfigClient = async (): Promise<YamlMcpConfig> => {
  try {
    const response = await fetch('/api/mcp-servers-config');

    if (!response.ok) {
      throw new Error('Failed to load MCP server configurations');
    }

    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error loading MCP servers configuration:', error);
    return { servers: [] };
  }
};
