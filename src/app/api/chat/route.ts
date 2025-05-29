import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';
import { getModelProvider } from '@/models/enumModels';
import { headersToRecord } from '@/utils/mcpUtils';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createMCPClient, streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface ChatRequest {
  messages: any[];
  instances: IInstance[];
  tokenData: IToken; // Currently selected token
  allTokens?: IToken[]; // All available tokens
  model: string;
  mcpServers?: IMcpServer[];
}

async function initializeMcpClients(mcpServers: IMcpServer[], tokens: IToken[] = [], instances: IInstance[] = []) {
  const activeServers = mcpServers.filter((server) => server.isActive);
  const clients: Array<{ client: any; server: IMcpServer }> = [];
  // Use Record<string, any> to properly type the dynamic keys
  const toolSets: Record<string, any> = {};

  console.log('activeServers: ', JSON.stringify(activeServers, null, 2));

  for (const server of activeServers) {
    try {
      let client;

      // Convert header configs to a simple header object
      const headers = headersToRecord(server.headers);

      // Create client based on transport type
      if (server.type === 'sse') {
        // For SSE transports
        const options: any = {
          transport: {
            type: 'sse',
            url: server.url,
            headers: headers,
          },
        };

        console.log('options: ', JSON.stringify(options, null, 2));

        client = await experimental_createMCPClient(options);
      } else if (server.type === 'http') {
        try {
          // Use the StreamableHTTPClientTransport with correct options structure
          const options: any = {
            transport: {
              type: 'http',
              url: server.url,
              headers,
            },
          };

          console.log('options: ', JSON.stringify(options, null, 2));

          client = await experimental_createMCPClient(options);
        } catch (error) {
          console.error(`Failed to initialize HTTP client for ${server.name}:`, error);
        }
      }

      if (client) {
        clients.push({ client, server });
        const tools = await client.tools();

        console.log(`Initialized MCP client for ${server.name} with tools:`, Object.keys(tools));

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
    instances,
    tokenData,
    allTokens = [],
    model = 'gpt-4o-mini',
    mcpServers = [],
  }: ChatRequest = await req.json();

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

  console.log('Chat request:', {
    messages,
    instances,
    tokenData: {
      name: tokenToUse.name,
      provider: tokenToUse.provider,
      active: tokenToUse.active,
    },
    model,
    mcpServers,
  });
  try {
    // Initialize MCP clients with all available context
    console.log('mcpTools: ', mcpServers);
    const { clients, tools: mcpTools } = await initializeMcpClients(updatedMcpServers, allTokens, instances);

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
