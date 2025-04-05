import { IAgentState } from '../types/IAgentState';

export const generateResponse = (state: IAgentState): IAgentState => {
  if (state.errors.length > 0) {
    // If there are errors, include them in the response
    return {
      ...state,
      finalResponse: state.errors.join('\n'),
    };
  }

  // Combine responses from all executed agents
  const responseValues = Object.values(state.responses);
  if (responseValues.length > 0) {
    return {
      ...state,
      finalResponse: responseValues.join('\n\n'),
    };
  } else {
    // If no agent was executed but no errors, use fallback message
    return {
      ...state,
      finalResponse:
        "I wasn't able to process your request. Could you please be more specific about what you'd like to do?",
    };
  }
};

export const shouldContinue = (state: IAgentState): { next: string } => {
  if (state.identifiedProducts.length > 0 && state.currentProduct) {
    // There are more products to process
    return { next: 'instance_validator' };
  } else {
    // All products processed, generate final response
    return { next: 'generate_response' };
  }
};
