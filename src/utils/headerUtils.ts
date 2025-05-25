import { IInstance } from '@/models/IInstance';
import { HeaderConfig } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';

/**
 * Get predefined headers for specific MCP servers
 * @param serverName The name of the server
 * @returns Array of header configurations
 */
export const getPredefinedHeaders = (serverName: string): HeaderConfig[] => {
  switch (serverName.toLowerCase()) {
    case 'sitecore':
      return [
        {
          key: 'x-personalize-tenant-id',
          value: '',
          required: true,
          source: {
            type: 'instance',
            field: 'tenantId',
          },
        },
        {
          key: 'x-personalize-api-key',
          value: '',
          required: true,
          source: {
            type: 'token',
            field: 'token',
          },
        },
      ];
    // Add other predefined server configurations as needed
    default:
      return [];
  }
};

/**
 * Populate header values from available tokens and instances
 */
export const populateHeaderValues = (
  headers: HeaderConfig[],
  tokens: IToken[] = [],
  instances: IInstance[] = []
): HeaderConfig[] => {
  return headers.map((header) => {
    if (!header.source) {
      return header;
    }

    // Try to find a value from tokens or instances
    if (header.source.type === 'token') {
      // Find relevant tokens (prefer active ones)
      const activeTokens = tokens.filter((t) => t.active);
      const relevantTokens = activeTokens.length ? activeTokens : tokens;

      // For Personalize API key, look for tokens with provider: OpenAI (as an example)
      if (header.key === 'x-personalize-api-key') {
        const token = relevantTokens.find(
          (t) =>
            t.provider === enumTokenProviders.OpenAI ||
            t.name.toLowerCase().includes('personalize') ||
            t.name.toLowerCase().includes('sitecore')
        );

        if (token && header.source.field) {
          return {
            ...header,
            value: (token[header.source.field as keyof IToken] as string) || '',
          };
        }
      }
    }

    if (header.source.type === 'instance') {
      // Try to find a matching instance
      const instance = instances.find(
        (i) => i.name.toLowerCase().includes('personalize') || i.name.toLowerCase().includes('sitecore')
      );

      if (instance && header.source.field) {
        // Safely access nested properties if field has dots
        const fieldParts = header.source.field.split('.');
        let value: any = instance;

        for (const part of fieldParts) {
          if (value && value[part] !== undefined) {
            value = value[part];
          } else {
            value = '';
            break;
          }
        }

        if (value && typeof value === 'string') {
          return {
            ...header,
            value,
          };
        }
      }
    }

    return header;
  });
};
