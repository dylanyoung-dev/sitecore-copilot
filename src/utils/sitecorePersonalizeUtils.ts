import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';

/**
 * Helper to find and configure the Sitecore Personalize MCP server with the proper headers
 * @param mcpServers List of configured MCP servers
 * @param tokens List of configured API tokens
 * @param instances List of configured instances
 * @returns The updated Personalize MCP server with headers, if found
 */
export function configureSitecorePersonalizeMcp(
  mcpServers: IMcpServer[] = [],
  tokens: IToken[] = [],
  instances: IInstance[] = []
): IMcpServer | undefined {
  // Find the Sitecore Personalize MCP server
  const personalizeMcpServer = mcpServers.find(
    (server) => server.name.toLowerCase().includes('sitecore') && server.name.toLowerCase().includes('personalize')
  );

  if (!personalizeMcpServer) {
    return undefined;
  }
  // Find the required headers
  const tenantId = instances.find(
    (instance) =>
      instance.name.toLowerCase().includes('personalize') || instance.product.toLowerCase().includes('personalize')
  )?.fields?.tenantId?.value;

  // Find an appropriate token
  const apiToken = tokens.find((token) => token.provider === enumTokenProviders.OpenAI && token.active)?.token;

  // If we have the required headers, update the server configuration
  if (tenantId && apiToken) {
    // Create or update headers
    const headers = personalizeMcpServer.headers || [];

    // Update or add tenant ID header
    const tenantIdHeaderIndex = headers.findIndex((h) => h.key === 'x-personalize-tenant-id');
    if (tenantIdHeaderIndex >= 0) {
      headers[tenantIdHeaderIndex].value = tenantId;
    } else {
      headers.push({
        key: 'x-personalize-tenant-id',
        value: tenantId,
        required: true,
        source: {
          type: 'instance',
          field: 'tenantId',
        },
      });
    }

    // Update or add API key header
    const apiKeyHeaderIndex = headers.findIndex((h) => h.key === 'x-personalize-api-key');
    if (apiKeyHeaderIndex >= 0) {
      headers[apiKeyHeaderIndex].value = apiToken;
    } else {
      headers.push({
        key: 'x-personalize-api-key',
        value: apiToken,
        required: true,
        source: {
          type: 'token',
          field: 'token',
        },
      });
    }

    // Return the updated server
    return {
      ...personalizeMcpServer,
      headers,
    };
  }

  return personalizeMcpServer;
}
