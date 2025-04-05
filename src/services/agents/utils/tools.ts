import { Tool } from 'ai';

export const getToolDescriptionsForProduct = (tools: Tool[]): string => {
  return tools.map((tool) => `- ${tool.type}: ${tool.description}`).join('\n');
};
