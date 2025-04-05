import { IAgentState } from '../types/IAgentState';

// Fallback handler for unknown intents
export const fallbackHandler = async (state: IAgentState, streamData: any): Promise<IAgentState> => {
  const availableProducts = [...new Set(state.instances.map((inst) => inst.apiRoutes.product))];

  streamData.update({
    activeApiInfo: {
      apiRouteId: null,
      product: null,
      environment: null,
      fieldConfigurations: null,
    },
    fallback: true,
  });

  let fallbackMessage = "I'm not sure which product you'd like to work with. ";

  if (availableProducts.length > 0) {
    fallbackMessage += `You have instances configured for: ${availableProducts.join(
      ', '
    )}. Could you please specify which one you'd like to use?`;
  } else {
    fallbackMessage +=
      "You don't have any product instances configured yet. Please configure at least one instance to get started.";
  }

  return {
    ...state,
    finalResponse: fallbackMessage,
    activeApiInfo: {
      apiRouteId: null,
      product: null,
      environment: null,
      fieldConfigurations: null,
    },
  };
};
