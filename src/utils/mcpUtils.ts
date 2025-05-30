import { IHeaderConfig } from '@/models/IHeaderConfig';
import { IInstance } from '@/models/IInstance';
import { experimental_createMCPClient } from 'ai';
import {
  StreamableHTTPClientTransport,
  StreamableHTTPClientTransportOptions,
} from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/**
 * Convert header configurations to a headers record
 * @param headerConfigs Array of header configurations
 * @param instances Array of instances to match against
 * @returns Record of header key-value pairs
 */
export function headersToRecord(headerConfigs: any[] = [], instances: IInstance[] = []): Record<string, string> {
  const headers: Record<string, string> = {};

  if (!headerConfigs || !Array.isArray(headerConfigs)) return headers;

  // Process each header configuration
  for (const config of headerConfigs) {
    if (config.source?.type === 'apiDefinition' && config.source.fieldId) {
      // Find matching instance with the same apiDefinitionId as the header's parent server
      const matchingInstance = instances.find(
        (instance) => instance.apiDefinitionId === config.server?.apiDefinitionId && instance.isActive
      );

      if (matchingInstance && matchingInstance.fields) {
        // Look up the field value from the matching instance
        const fieldValue = matchingInstance.fields[config.source.fieldId];
        if (fieldValue) {
          // Check if fieldValue is an object with a value property or a string
          headers[config.key] =
            typeof fieldValue === 'object' && fieldValue.value !== undefined
              ? String(fieldValue.value)
              : String(fieldValue);
          continue;
        }
      }

      // If we couldn't find a value, set empty string for required headers
      if (config.required) {
        headers[config.key] = '';
      }
    } else if (config.value) {
      // For manual values, just use the value directly
      headers[config.key] = config.value;
    }
  }

  return headers;
}

/**
 * Create fetch options with headers for MCP clients
 * @param headers Record of headers to include
 * @returns Fetch options object or undefined if no headers
 */
export function createFetchOptions(headers: Record<string, string> = {}): object | undefined {
  if (Object.keys(headers).length === 0) {
    return undefined;
  }

  return { headers };
}

/**
 * Create an MCP client configuration with proper headers support
 * @param url The MCP server URL
 * @param headers Headers to include in requests
 * @param type The transport type ('http' or 'sse')
 * @returns Configuration object for experimental_createMCPClient
 */
export function createMcpClientConfig(
  url: string,
  headers: Record<string, string> = {},
  type: 'http' | 'sse' = 'http'
): any {
  const hasHeaders = Object.keys(headers).length > 0;

  if (type === 'sse') {
    return {
      transport: {
        type: 'sse',
        url,
        // Some MCP servers may not support headers in SSE
        // So we only add them if they exist
        ...(hasHeaders && { fetchOptions: { headers } }),
      },
    };
  } else {
    try {
      // Use the StreamableHTTPClientTransport with correct options structure
      const urlObject = new URL(url);
      // Pass headers directly instead of using fetchOptions
      const transportOptions: StreamableHTTPClientTransportOptions =
        Object.keys(headers).length > 0
          ? {
              requestInit: {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json', Accept: 'application/json' },
              },
            }
          : {};

      const transport = new StreamableHTTPClientTransport(urlObject, transportOptions);

      return { transport };
    } catch (error) {
      console.error(`Failed to initialize HTTP client for ${url}:`, error);
    }
  }
}
