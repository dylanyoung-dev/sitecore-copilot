'use client';

import { cn } from '@/lib/utils';
import { getModelsByTokenProvider } from '@/models/enumModels';
import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { enumTokenProviders, IToken } from '@/models/IToken';
import { useChat } from '@ai-sdk/react';
import { ArrowUpRight, Blocks, Brain, Globe2, Loader2, RefreshCw, Send, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface CopilotChatProps {
  instances: IInstance[];
  tokens: IToken[];
}

export const CopilotChat: React.FC<CopilotChatProps> = ({ instances, tokens }) => {
  const [selectedInstance, setSelectedInstance] = useState<IInstance | undefined>(instances[0]);
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string; provider: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [mcpServers, setMcpServers] = useState<IMcpServer[]>([]);
  const [sessionEnabledServers, setSessionEnabledServers] = useState<Record<string, boolean>>({});

  // Get available models based on all token providers
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      // Get active tokens first, or all tokens if none are active
      const activeTokens = tokens.filter((t) => t.active);
      const tokensToUse = activeTokens.length > 0 ? activeTokens : tokens;

      // Collect all models from all providers
      let allModels: { id: string; name: string; provider: string }[] = [];

      tokensToUse.forEach((token) => {
        const providerModels = getModelsByTokenProvider(token.provider as enumTokenProviders);
        if (providerModels.length > 0) {
          // Add to our collection with provider info
          allModels = [
            ...allModels,
            ...providerModels.map((m) => ({
              id: m.id,
              name: m.name,
              provider: token.provider,
            })),
          ];
        }
      });

      // Remove duplicates if any
      const uniqueModels = allModels.filter((model, index, self) => index === self.findIndex((m) => m.id === model.id));

      setAvailableModels(uniqueModels);

      // Sort models for better organization
      // First by provider, then by name
      uniqueModels.sort((a, b) => {
        if (a.provider === b.provider) {
          return a.name.localeCompare(b.name);
        }
        // Put OpenAI first, then alphabetical
        if (a.provider === 'openai') return -1;
        if (b.provider === 'openai') return 1;
        return a.provider.localeCompare(b.provider);
      });

      // Set default model (prefer OpenAI's gpt-4o-mini if available)
      const defaultModel = uniqueModels.find((m) => m.id === 'gpt-4o-mini') || uniqueModels[0];
      if (defaultModel) {
        setSelectedModel(defaultModel.id);
      }
    }
  }, [tokens]);

  // Find the appropriate token for the selected model
  const getTokenForModel = () => {
    const modelInfo = availableModels.find((m) => m.id === selectedModel);
    if (modelInfo) {
      // Get active token first, or any token for this provider
      const activeToken = tokens.find((t) => t.active && t.provider === modelInfo.provider);
      return activeToken || tokens.find((t) => t.provider === modelInfo.provider);
    }
    return tokens.find((t) => t.active) || tokens[0]; // Fallback
  };

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      instances: instances,
      tokenData: getTokenForModel(),
      allTokens: tokens,
      model: selectedModel,
      mcpServers: mcpServers.filter((server) => server.isActive && (sessionEnabledServers[server.id] ?? false)),
    },
  });

  const [showTools, setShowTools] = useState(false);
  const [availableTools, setAvailableTools] = useState<string[]>([]);
  // Load MCP servers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mcp-servers');
      if (saved) {
        const servers = JSON.parse(saved);
        setMcpServers(servers);

        // Initialize all active servers as enabled for this session
        const enabledMap: Record<string, boolean> = {};
        servers.forEach((server: IMcpServer) => {
          enabledMap[server.id] = server.isActive;
        });
        setSessionEnabledServers(enabledMap);
      }
    } catch (error) {
      console.error('Error loading MCP servers:', error);
    }
  }, []);

  // Fetch all tools from all MCP servers in localStorage
  const fetchAvailableTools = async () => {
    try {
      const allTools = mcpServers
        .filter((server) => server.isActive)
        .flatMap((server) => (Array.isArray(server.tools) ? server.tools : []))
        .filter(Boolean);

      // Remove duplicates
      setAvailableTools(Array.from(new Set(allTools)));
      setShowTools(true);
    } catch (error) {
      console.error('Error fetching available tools:', error);
      setAvailableTools([]);
      setShowTools(true);
    }
  };

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    const prompt = `I'd like to use the ${tool} tool. Can you help me with that?`;
    handleInputChange({ target: { value: prompt } } as any);
    setShowTools(false);
  };

  // Reference to the messages div for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Welcome! I am your Sitecore DXP specialist. How can I help you with your Sitecore operations today?',
        },
      ]);
    }
  }, []);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Welcome! I am your Sitecore DXP specialist. How can I help you with your Sitecore operations today?',
      },
    ]);
  };

  // Preset message options
  const presetMessages = [
    { label: 'Get Content', value: 'How do I export content?' },
    { label: 'Generate a CSV', value: 'Now that I have my data can you convert it to CSV format?' },
    {
      label: 'Profile the Content',
      value: 'Take my existing data and create a content profile for each piece of content?',
    },
  ];

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col shadow-md">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> <CardTitle>Copilot</CardTitle>
          </div>
          <div className="flex gap-2">
            {' '}
            <Select value={selectedModel} onValueChange={(value: string) => setSelectedModel(value)}>
              <SelectTrigger className="w-[220px] h-8 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {/* Group models by provider */}
                {Object.entries(
                  availableModels.reduce((acc, model) => {
                    if (!acc[model.provider]) {
                      acc[model.provider] = [];
                    }
                    acc[model.provider].push(model);
                    return acc;
                  }, {} as Record<string, typeof availableModels>)
                ).map(([provider, models]) => (
                  <div key={provider}>
                    <div className="px-2 py-1.5 text-xs font-semibold bg-muted/50">{provider.toUpperCase()}</div>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full w-full pr-1">
            <div className="flex flex-col gap-4 p-4">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-4 min-w-0 animate-fadeIn">
                  {m.role === 'assistant' && (
                    <div className="mt-2 shrink-0">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg break-words',
                      m.role === 'assistant' ? 'bg-muted' : 'bg-primary/10'
                    )}
                  >
                    {m.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, ...props }) {
                            const match = /language-(\w+)/.exec(props.className || '');
                            return !(props as any).inline ? (
                              <div className="relative">
                                <pre className="my-4 p-4 bg-muted-foreground/10 rounded-lg overflow-x-auto">
                                  <code
                                    className={cn('font-mono text-sm', match?.[1] && `language-${match[1]}`)}
                                    {...props}
                                  >
                                    {String(props.children).replace(/\n$/, '')}
                                  </code>
                                </pre>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute right-2 top-2 h-7 opacity-70 hover:opacity-100"
                                  onClick={() => navigator.clipboard.writeText(String(props.children))}
                                >
                                  Copy
                                </Button>
                              </div>
                            ) : (
                              <code
                                className="bg-muted-foreground/20 px-1.5 py-0.5 rounded-md font-mono text-sm"
                                {...props}
                              >
                                {props.children}
                              </code>
                            );
                          },
                          ul({ children }) {
                            return <ul className="list-disc pl-6 my-3">{children}</ul>;
                          },
                          ol({ children }) {
                            return <ol className="list-decimal pl-6 my-3">{children}</ol>;
                          },
                          li({ children }) {
                            return <li className="mb-1">{children}</li>;
                          },
                          p({ children }) {
                            return <p className="mb-3 last:mb-0">{children}</p>;
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 min-w-0">
                  <div className="mt-2 shrink-0">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 px-4 py-4 rounded-lg break-words bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-border mt-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-background">
            <div className="flex flex-wrap gap-2">
              {presetMessages.map((preset, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleInputChange({ target: { value: preset.value } } as any)}
                >
                  {preset.label}
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              ))}
            </div>

            {/* Textarea and send button */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about content operations..."
                className="pr-20 min-h-[80px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <TooltipProvider>
                <div className="absolute right-2 bottom-2 flex gap-1">
                  <Popover open={showTools} onOpenChange={setShowTools}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        aria-label="Show available tools"
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" side="top" className="min-w-[260px] w-72 p-0 text-sm">
                      <div className="max-h-60 overflow-y-auto">
                        <ul className="py-2">
                          {mcpServers.length === 0 ? (
                            <li className="text-muted-foreground text-xs px-4 py-2">No tools found.</li>
                          ) : (
                            mcpServers
                              .filter((server) => server.isActive)
                              .map((server, idx) => (
                                <li key={idx} className="flex items-center justify-between px-4 py-2 hover:bg-muted">
                                  <div
                                    className="flex items-center gap-2 cursor-pointer flex-1"
                                    onClick={() => handleToolSelect(server.name)}
                                  >
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted">
                                      {server.type === 'http' ? (
                                        <Globe2 className="h-3 w-3" />
                                      ) : (
                                        <Blocks className="h-3 w-3" />
                                      )}
                                    </div>
                                    <span>{server.name}</span>
                                  </div>
                                  <Switch
                                    checked={sessionEnabledServers[server.id] ?? false}
                                    onCheckedChange={(checked) => {
                                      setSessionEnabledServers((prev) => ({
                                        ...prev,
                                        [server.id]: checked,
                                      }));
                                    }}
                                    aria-label={`Enable ${server.name} for this session`}
                                  />
                                </li>
                              ))
                          )}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        disabled={isLoading || !input.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* Footer with action buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" onClick={handleClearChat}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Clear chat
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Start a new conversation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
