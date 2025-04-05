import { Products } from '@/models/IInstance';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Tool } from '@langchain/core/tools';
import { IAgentState } from '../types/IAgentState';
import { getLLM } from './getLlm';

export const executeFunctionCalls = async (
  state: IAgentState,
  product: Products,
  tools: Tool[],
  userInput: string,
  callbacks: any
) => {
  const llm = getLLM(state.openAiKey, state.openAiModel);
  llm.bindTools(tools);

  // Get tool descriptions for the prompt
  const toolDescriptions = tools.map((t) => `- ${t.name}: ${t.description}`).join('\n');

  const systemPrompt = `
      You are a ${product} specialist assistant.
      You have access to the following API tools:
      ${toolDescriptions}
      
      Use these tools when necessary to help answer the user's question.
      Always consider whether a tool is needed before using it.
      If you need to use multiple tools to answer a question, use them in sequence.
      
      You're using the ${state.selectedInstance?.apiRoutes.environment} environment with API endpoint: ${state.selectedInstance?.endpoint}
      Your instance name is: ${state.selectedInstance?.name}
    `;

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  // Create a temporary runnable for this function calling sequence
  const runnable = chatPrompt.pipe(llm);

  let responseText = '';
  const functionResults = [];

  // Execute with streaming to capture the agent's thought process
  const stream = await runnable.stream({
    input: userInput,
    chat_history: [],
    agent_scratchpad: [],
  });

  for await (const chunk of stream) {
    if (chunk.content) {
      responseText += chunk.content;
      callbacks.onCompletion?.(responseText);

      // Use the experimental_streamData callback instead of StreamData
      callbacks.experimental_onMetadata?.({
        thinking: responseText,
      });
    }

    // If tool calls are present, execute them
    if (chunk.tool_calls && chunk.tool_calls.length > 0) {
      for (const toolCall of chunk.tool_calls) {
        const tool = tools.find((t) => t.name === toolCall.name);

        if (tool) {
          try {
            // Update the thinking state to show function calling
            callbacks.experimental_onMetadata?.({
              thinking: `${responseText}\n\nCalling function: ${toolCall.name}...`,
            });

            const result = await tool.invoke(toolCall.args);
            functionResults.push({
              functionName: toolCall.name,
              result: JSON.parse(result),
            });

            // Update with the function result
            callbacks.experimental_onMetadata?.({
              thinking: `${responseText}\n\nFunction ${toolCall.name} returned: ${result}`,
            });
          } catch (error: unknown) {
            console.error(`Error executing tool ${toolCall.name}:`, error);
            functionResults.push({
              functionName: toolCall.name,
              result: {
                error: `Failed to execute: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            });
          }
        }
      }
    }
  }

  return { responseText, functionResults };
};
