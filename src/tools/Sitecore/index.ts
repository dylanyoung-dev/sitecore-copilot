import { tool } from 'ai';
import { z } from 'zod';

enum SitecoreProduct {
  Personalize = 'Personalize',
  XMCloudContent = 'XMC-Content',
}

export const SelectSitecoreProduct = () => {
  return tool({
    description: 'Determines which product(s) that the user wants to work with in Sitecore.',
    parameters: z.object({
      productName: z.nativeEnum(SitecoreProduct),
    }),
    execute: async ({ productName }) => {
      return {
        product: productName,
      };
    },
  });
};
