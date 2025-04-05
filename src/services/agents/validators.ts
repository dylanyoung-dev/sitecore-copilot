import { Environments, Products } from '@/models/IInstance';
import { z } from 'zod';
import { IAgentState } from './types/IAgentState';

export const requestSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string().optional(),
      role: z.enum(['user', 'assistant', 'system', 'function', 'data', 'tool']),
      content: z.string(),
      name: z.string().optional(),
    })
  ),
  instances: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      endpoint: z.string(),
      configuration: z.record(z.string()),
      apiRoutes: z.object({
        id: z.string(),
        product: z.nativeEnum(Products),
        fields: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            isRequired: z.boolean(),
          })
        ),
        environment: z.nativeEnum(Environments),
      }),
      token: z.string(),
      expiration: z.string(),
      isDefault: z.boolean(),
    })
  ),
  // OpenAI configuration
  openAiConfig: z
    .object({
      apiKey: z.string().optional(),
      model: z.string().optional(),
    })
    .optional(),
});

export const instanceValidator = (state: IAgentState): { next: string } => {
  if (state.identifiedProducts.length === 0) {
    return { next: 'fallback_handler' };
  }

  // Get the first identified product
  const currentProduct = state.identifiedProducts[0];

  // Find instances that support this product
  const compatibleInstances = state.instances.filter((instance) => instance.apiRoutes.product === currentProduct);

  if (compatibleInstances.length === 0) {
    // No compatible instances found
    state.errors.push(
      `No configured instances found for ${currentProduct}. Please configure an instance for this product.`
    );

    // Remove this product from the list and check if we have any more
    const remainingProducts = state.identifiedProducts.slice(1);
    if (remainingProducts.length > 0) {
      state.identifiedProducts = remainingProducts;
      return { next: 'instance_validator' };
    } else {
      return { next: 'generate_response' };
    }
  }

  // Select the default instance if available, otherwise use the first one
  const selectedInstance = compatibleInstances.find((i) => i.isDefault) || compatibleInstances[0];

  // Update state with the selected instance and product
  state.selectedInstance = selectedInstance;
  state.currentProduct = currentProduct;
  state.selectedApiRoute = selectedInstance.apiRoutes;

  // Now route to the appropriate product router
  return { next: `route_${currentProduct.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}` };
};
