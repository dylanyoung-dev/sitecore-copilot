import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';
import { getModelProvider } from '@/models/enumModels';
import { createMcpClientConfig, headersToRecord } from '@/utils/mcpUtils';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createMCPClient, streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { Langfuse } from 'langfuse-node';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Langfuse client
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
});

interface ChatRequest {
  messages: any[];
  instances: IInstance[];
  tokenData: IToken; // Currently selected token
  allTokens?: IToken[]; // All available tokens
  model: string;
  mcpServers?: IMcpServer[];
}

interface ToolCall {
  name: string;
  args: Record<string, any>;
}

interface Completion {
  content: string;
  role: string;
}

async function initializeMcpClients(mcpServers: IMcpServer[], instances: IInstance[] = []) {
  const activeServers = mcpServers.filter((server) => server.isActive);
  const clients: Array<{ client: any; server: IMcpServer }> = [];
  // Use Record<string, any> to properly type the dynamic keys
  const toolSets: Record<string, any> = {};

  for (const server of activeServers) {
    try {
      // Convert header configs to a simple header object
      const headers = headersToRecord(server, instances);

      console.log(`Creating MCP client for server: ${server.name} with headers:`, headers);

      const mcpConfiguration = createMcpClientConfig(server.url, headers, server.type);

      const client = await experimental_createMCPClient(mcpConfiguration);

      if (client) {
        clients.push({ client, server });
        const tools = await client.tools();

        // //console.log(`Initialized MCP client for ${server.name} with tools:`, Object.keys(tools));

        // // Add server name as prefix to avoid tool name conflicts
        // // Use Record<string, any> for the prefixed tools
        // const prefixedTools: Record<string, any> = {};
        // Object.entries(tools).forEach(([key, value]) => {
        //   prefixedTools[`${server.name}_${key}`] = value;
        // });

        // Object.assign(toolSets, prefixedTools);
        Object.assign(toolSets, tools);
      }
    } catch (error) {
      //console.error(`Failed to initialize MCP client for ${server.name}:`, error);
    }
  }

  console.log('Initialized MCP Clients:', JSON.stringify(toolSets, null, 2));

  return { clients, toolSets };
}

export async function POST(req: Request) {
  const {
    messages,
    instances,
    tokenData,
    allTokens = [],
    model = 'gpt-4o-mini',
    mcpServers = [],
  }: ChatRequest = await req.json();

  // Create a new trace for this chat session
  const trace = langfuse.trace({
    name: 'chat-session',
    metadata: {
      model,
      provider: tokenData.provider,
      instances: instances.map((i) => i.name),
      mcpServers: mcpServers.map((s) => s.name),
    },
  });

  // Instead, just use the servers as provided (they should already have correct headers from YAML/config).
  const updatedMcpServers = mcpServers;

  // Get the model provider to ensure we're using the right token
  const modelProviderName = getModelProvider(model);

  // Use the provided token or find the appropriate token for the model
  let tokenToUse = tokenData;

  // If allTokens is provided and model provider doesn't match token provider,
  // try to find a matching token
  if (allTokens.length > 0 && modelProviderName) {
    // Find active token for this provider first
    const matchingToken =
      allTokens.find((t) => t.provider === modelProviderName.toLowerCase() && t.active) ||
      allTokens.find((t) => t.provider === modelProviderName.toLowerCase());

    if (matchingToken) {
      tokenToUse = matchingToken;
    }
  }

  try {
    const { toolSets } = await initializeMcpClients(updatedMcpServers, instances);

    //console.log('Inialized MCP Clients: ', JSON.stringify(clients, null, 2));
    console.log('Tools: ', JSON.stringify(toolSets, null, 2));

    // Create appropriate AI client based on token provider
    let aiClient;

    switch (tokenToUse.provider) {
      case enumTokenProviders.OpenAI:
        aiClient = createOpenAI({
          apiKey: tokenToUse.token,
        });
        break;
      case enumTokenProviders.Anthropic:
        aiClient = createAnthropic({
          apiKey: tokenToUse.token,
        });
        break;
      default:
        aiClient = createOpenAI({
          apiKey: tokenToUse.token,
        });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are a Copilot assistant. 

    Instructions
    
    Format your responses using markdown:
    - Use **bold** for important concepts
    - Use bullet points for lists
    - Keep responses concise and practical
    - Break up long responses with headings
    
    Respond concisely and focus on practical solutions.`,
    };

    // Log the input messages
    await trace.span({
      name: 'input-messages',
      input: messages,
    });

    try {
      const result = streamText({
        model: aiClient(model),
        messages: [systemPrompt, ...messages],
        tools: toolSets,
        maxSteps: 3,
      });

      // Log the completion
      await trace.span({
        name: 'completion',
        metadata: {
          model,
          provider: tokenToUse.provider,
        },
      });

      // End the trace
      await trace.update({
        metadata: { status: 'success' },
      });

      return result.toDataStreamResponse();
    } catch (toolError) {
      // Log the error
      await trace.span({
        name: 'error',
        level: 'ERROR',
        input: toolError,
      });
      await trace.update({
        metadata: { status: 'error' },
      });

      console.error('Tool execution error:', toolError);
      return new Response(
        JSON.stringify({
          error: 'Tool execution failed',
          details: (toolError as any)?.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    // Log the error
    await trace.span({
      name: 'error',
      level: 'ERROR',
      input: error,
    });
    await trace.update({
      metadata: { status: 'error' },
    });

    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: (error as any)?.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
