import { Products } from '@/models/IInstance';
import { IAgentState } from '../../types/IAgentState';
import { executeFunctionCalls } from '../../utils/executeFunctionCalls';

export const routeXMCloud = async (state: IAgentState, streamData: any): Promise<IAgentState> => {
  if (!state.selectedInstance) {
    return {
      ...state,
      errors: [...state.errors, 'No instance selected for XM Cloud'],
    };
  }

  // Determine which API route to use based on user intent
  const apiRoute = state.selectedInstance.apiRoutes;

  // Update active API info
  const activeApiInfo = {
    apiRouteId: apiRoute.id,
    product: Products.XMCloud,
    environment: apiRoute.environment,
    fieldConfigurations: apiRoute.fields,
  };

  streamData.update({
    activeApiInfo,
    product: Products.XMCloud,
    environment: apiRoute.environment,
    apiName: state.selectedInstance.name,
    fieldConfigurations: apiRoute.fields,
  });

  // Execute function calls for XM Cloud
  const { responseText, functionResults } = await executeFunctionCalls(
    state,
    Products.XMCloud,
    [],
    state.userInput,
    streamData
  );

  // Update state with the response
  return {
    ...state,
    responses: {
      ...state.responses,
      [apiRoute.id]: responseText,
    },
    functionResults: [...state.functionResults, ...functionResults],
    // Remove current product from list
    identifiedProducts: state.identifiedProducts.slice(1),
    // Set next product if available
    currentProduct: state.identifiedProducts.length > 1 ? state.identifiedProducts[1] : null,
    selectedApiRoute: apiRoute,
    activeApiInfo,
  };
};
