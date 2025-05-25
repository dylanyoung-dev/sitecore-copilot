import { IInstance } from '@/models/IInstance';
import { HeaderConfig } from '@/models/IMcpServer';
import { IToken } from '@/models/IToken';

/**
 * Populate header values from available tokens and instances
 */
export function populateHeaderValues(
  headers: HeaderConfig[],
  tokens: IToken[] = [],
  instances: IInstance[] = []
): HeaderConfig[] {
  return headers.map((header) => {
    if (!header.source) return header;

    const { type, field } = header.source;
    let value = header.value;

    if (type === 'token' && field) {
      const provider = header.source.provider;
      const token = tokens.find((t) => (provider ? t.provider === provider : true) && t.active);
      if (token && token[field as keyof IToken]) {
        value = String(token[field as keyof IToken]);
      }
    }

    if (type === 'instance' && field) {
      const filter = header.source.instanceFilter;
      let instance: IInstance | undefined;

      if (filter) {
        const [key, val] = filter.split('=');
        instance = instances.find((i) => i[key as keyof IInstance] === val);
      } else {
        instance = instances[0]; // Default to first instance if no filter
      }

      if (instance?.fields?.[field]?.value) {
        value = instance.fields[field].value;
      }
    }

    return { ...header, value };
  });
}
