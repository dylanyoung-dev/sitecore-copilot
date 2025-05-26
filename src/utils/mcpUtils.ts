import { IHeaderConfig } from '@/models/IHeaderConfig';

/**
 * Convert header configurations to a headers record
 * @param headers Array of header configurations
 * @returns Record of header key-value pairs
 */
export function headersToRecord(headers: IHeaderConfig[] = []): Record<string, string> {
  const result: Record<string, string> = {};

  if (!headers || headers.length === 0) {
    return result;
  }

  headers.forEach((header) => {
    if (header.key && header.value) {
      result[header.key] = header.value;
    }
  });

  return result;
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
  }

  // For HTTP transport type
  return {
    transport: {
      type: 'http',
      url,
      ...(hasHeaders && { fetchOptions: { headers } }),
    },
  };
}
