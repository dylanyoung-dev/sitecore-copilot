export interface IToken {
  id: string;
  name: string;
  category: enumTokenCategories;
  provider: enumTokenProviders;
  category: enumTokenCategories;
  provider: enumTokenProviders;
  token: string;
  active: boolean; // Whether the token is active and should be used
  type?: enumTokenTypes; // Optional, for backward compatibility
}

// Types of tokens (for legacy support)
export enum enumTokenTypes {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  // Add other token types as needed
}

// Top-level token categories
export enum enumTokenCategories {
  AI = 'ai',
  BusinessTools = 'business-tools',
  DevOps = 'devops',
}

// Providers within each category
export enum enumTokenProviders {
  // AI providers
  OpenAI = 'openai',
  Anthropic = 'anthropic',

  // Business tools providers
  Atlassian = 'atlassian',
  Salesforce = 'salesforce',

  // DevOps providers
  GitHub = 'github',
  Azure = 'azure',
}

// Map providers to their categories
export const providerCategoryMap: Record<enumTokenProviders, enumTokenCategories> = {
  [enumTokenProviders.OpenAI]: enumTokenCategories.AI,
  [enumTokenProviders.Anthropic]: enumTokenCategories.AI,
  [enumTokenProviders.Atlassian]: enumTokenCategories.BusinessTools,
  [enumTokenProviders.Salesforce]: enumTokenCategories.BusinessTools,
  [enumTokenProviders.GitHub]: enumTokenCategories.DevOps,
  [enumTokenProviders.Azure]: enumTokenCategories.DevOps,
};
