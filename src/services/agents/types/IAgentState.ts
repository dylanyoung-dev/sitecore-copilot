import { Environments, IApiRoutes, IFieldConfiguration, IInstance, Products } from '@/models/IInstance';

export interface IAgentState {
  userInput: string;
  instances: IInstance[];
  identifiedProducts: Products[];
  currentProduct: Products | null;
  selectedApiRoute: IApiRoutes | null;
  selectedInstance: IInstance | null;
  responses: Record<string, string>; // Key is API route ID
  errors: string[];
  finalResponse: string;
  activeApiInfo: {
    apiRouteId: string | null;
    product: Products | null;
    environment: Environments | null;
    fieldConfigurations: IFieldConfiguration[] | null;
  };
  // Function calling results
  functionResults: Array<{
    functionName: string;
    result: any;
  }>;
  // OpenAI configuration
  openAiKey: string | null;
  openAiModel: string | null;
}
