import { ChatOpenAI } from '@langchain/openai';

export const getLLM = (apiKey: string | null = null, model: string | null = null, streaming: boolean = true) => {
  const llm = new ChatOpenAI({
    openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
    modelName: model || 'gpt-4-turbo-preview',
    temperature: 0,
    streaming,
  });

  return llm;
};
