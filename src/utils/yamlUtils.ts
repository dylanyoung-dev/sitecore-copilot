import { IYamlMcpConfig } from '@/models/IYamlConfig';

/**
 * Client-side function to load MCP server configurations
 * This uses fetch to get the configuration from the API
 *
 * @returns Promise resolving to YamlMcpConfig object
 */
export const loadMcpServersConfigClient = async (): Promise<IYamlMcpConfig> => {
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
