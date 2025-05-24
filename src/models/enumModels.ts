import { enumTokenProviders } from './IToken';

// Map our token providers to AI providers
export enum AIProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
}

export interface ModelOption {
  id: string;
  name: string;
  provider: AIProvider;
}

export const models: ModelOption[] = [
  // OpenAI Models
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: AIProvider.OpenAI },
  { id: 'gpt-4o', name: 'GPT-4o', provider: AIProvider.OpenAI },
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: AIProvider.OpenAI },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: AIProvider.OpenAI },

  // Anthropic Models
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: AIProvider.Anthropic },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: AIProvider.Anthropic },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: AIProvider.Anthropic },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: AIProvider.Anthropic },
];

// Helper function to get available models by provider
export const getModelsByProvider = (provider: AIProvider): ModelOption[] => {
  return models.filter((model) => model.provider === provider);
};

// Helper function to get models by token provider
export const getModelsByTokenProvider = (tokenProvider: enumTokenProviders): ModelOption[] => {
  // Map token provider to AIProvider
  let aiProvider: AIProvider | undefined;

  switch (tokenProvider) {
    case enumTokenProviders.OpenAI:
      aiProvider = AIProvider.OpenAI;
      break;
    case enumTokenProviders.Anthropic:
      aiProvider = AIProvider.Anthropic;
      break;
    default:
      return [];
  }

  return getModelsByProvider(aiProvider);
};

// Helper function to get the provider for a specific model
export const getModelProvider = (modelId: string): string | undefined => {
  const model = models.find((m) => m.id === modelId);
  return model?.provider;
};
