import { Products } from '@/models/IInstance';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { IAgentState } from '../types/IAgentState';
import { getLLM } from '../utils/getLlm';

export const routerNode = async (state: IAgentState): Promise<IAgentState> => {
  const llm = getLLM(state.openAiKey, state.openAiModel, false);

  // Get the list of available products from instances
  const availableProducts = [...new Set(state.instances.map((inst) => inst.apiRoutes.product))];

  const routerPrompt = new SystemMessage({
    content: `
      You are a routing assistant that analyzes user requests to determine which products they want to interact with.
      Identify all products mentioned in the request from these categories:
      - ${Products.XpXm}: Anything related to XP/XM platform
      - ${Products.XMCloud}: Anything related to XM Cloud
      - ${Products.CDPPersonalize}: Anything related to CDP or Personalization
      
      Return a JSON array of product types mentioned in the request.
      Example: ["${Products.XpXm}", "${Products.CDPPersonalize}"]
      
      Only include products from this list: ${JSON.stringify(availableProducts)}
      If no specific products are mentioned or the request is ambiguous, return an empty array [].
      `,
  });

  const messages = [routerPrompt, new HumanMessage({ content: state.userInput })];

  const response = await llm.invoke(messages);

  // Extract product types from response
  try {
    const identifiedProducts = JSON.parse(response.content as string);
    // Convert string list to enum list and filter out invalid products
    const validProducts = Object.values(Products);
    const typedProducts = identifiedProducts
      .filter((p: string) => validProducts.includes(p as Products) && availableProducts.includes(p as Products))
      .map((p: string) => p as Products);

    return {
      ...state,
      identifiedProducts: typedProducts,
    };
  } catch (error) {
    console.error('Error parsing router LLM response:', error);
    // Fallback if response isn't proper JSON
    return {
      ...state,
      identifiedProducts: [],
    };
  }
};
