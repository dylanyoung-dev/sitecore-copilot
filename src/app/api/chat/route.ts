import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';
import { getModelProvider } from '@/models/enumModels';
import { createOpenAI } from '@ai-sdk/openai';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { experimental_createMCPClient, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ChatRequest {
  messages: any[];
  instanceData: IInstance;
  tokenData: IToken; // Currently selected token
  allTokens?: IToken[]; // All available tokens
  model: string;
  mcpServers?: IMcpServer[];
}

async function initializeMcpClients(mcpServers: IMcpServer[]) {
  const activeServers = mcpServers.filter((server) => server.isActive);
  const clients: Array<{ client: any; server: IMcpServer }> = [];
  // Use Record<string, any> to properly type the dynamic keys
  const toolSets: Record<string, any> = {};

  for (const server of activeServers) {
    try {
      let client;

      if (server.type === 'sse') {
        client = await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: server.url,
          },
        });
      } else if (server.type === 'http') {
        const transport = new StreamableHTTPClientTransport(new URL(server.url));
        client = await experimental_createMCPClient({ transport });
      }

      if (client) {
        clients.push({ client, server });
        const tools = await client.tools();

        // Add server name as prefix to avoid tool name conflicts
        // Use Record<string, any> for the prefixed tools
        const prefixedTools: Record<string, any> = {};
        Object.entries(tools).forEach(([key, value]) => {
          prefixedTools[`${server.name}_${key}`] = value;
        });

        Object.assign(toolSets, prefixedTools);
      }
    } catch (error) {
      console.error(`Failed to initialize MCP client for ${server.name}:`, error);
    }
  }

  return { clients, tools: toolSets };
}

export async function POST(req: Request) {
  const {
    messages,
    instanceData,
    tokenData,
    allTokens = [],
    model = 'gpt-4o-mini',
    mcpServers = [],
  }: ChatRequest = await req.json();

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

  console.log('Chat request:', {
    messages,
    instanceData,
    tokenData: {
      name: tokenToUse.name,
      provider: tokenToUse.provider,
      active: tokenToUse.active,
    },
    model,
    mcpServers,
  });

  try {
    // Initialize MCP clients
    const { clients, tools: mcpTools } = await initializeMcpClients(mcpServers);

    // Create appropriate AI client based on token provider
    let aiClient;

    switch (tokenToUse.provider) {
      case enumTokenProviders.OpenAI:
        aiClient = createOpenAI({
          apiKey: tokenToUse.token,
        });
        break;

      case enumTokenProviders.Anthropic:
        // For now, we'll use OpenAI but in a real implementation, you'd import and use the Anthropic client
        aiClient = createOpenAI({
          apiKey: tokenToUse.token,
        });
        // TODO: Replace with proper Anthropic client when available
        break;

      default:
        aiClient = createOpenAI({
          apiKey: tokenToUse.token,
        });
    }

    const tools: Record<string, any> = {
      ...mcpTools,
    };

    const systemPrompt = {
      role: 'system',
      content: `You are a Sitecore Expert assistant. 

    Instructions
    - Always ask to confirm before running any functions
    - Tool is for Marketers, so avoid showing how to do the request programmatically
    
    Format your responses using markdown:
    - Use **bold** for important concepts
    - Use bullet points for lists
    - Keep responses concise and practical
    - Break up long responses with headings
    
    Respond concisely and focus on practical solutions.`,
    };
    const result = streamText({
      model: aiClient(model),
      messages: [systemPrompt, ...messages],
      tools,
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
