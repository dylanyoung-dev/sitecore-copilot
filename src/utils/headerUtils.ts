import { IHeaderConfig } from '@/models/IHeaderConfig';
import { IInstance } from '@/models/IInstance';
import { IToken } from '@/models/IToken';

/**
 * Populate header values from available tokens and instances
 */
export function populateHeaderValues(headers: IHeaderConfig[]): IHeaderConfig[] {
  return headers.map((header) => {
    if (!header.source) return header;

    const { type } = header.source;
    let value = header.value;

    // The only type currently supported in IHeaderSource
    if (type === 'apiDefinition' && header.source.fieldId) {
      // This handles the case where a header value is mapped to an API definition field
      // The actual value will be populated at runtime when making requests
      const fieldId = header.source.fieldId;
      value = `{${fieldId}}`;
    }

    return { ...header, value };
  });
}
