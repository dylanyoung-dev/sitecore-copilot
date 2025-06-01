'use client';

import { cn } from '@/lib/utils';
import { IInstance } from '@/models/IInstance';
import { IMcpServer } from '@/models/IMcpServer';
import { IToken } from '@/models/IToken';
import { useChat } from '@ai-sdk/react';
import { ArrowUpRight, Brain, RefreshCw, Send, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { McpToolsDrawer } from './mcp/tools-ui';
import { ChatMessages } from './ui/chat-messages';
import { ModelSelector } from './ui/model-selector';
import { useMcpServers } from '@/hooks/use-mcp-servers';

interface CopilotChatProps {
  instances: IInstance[];
  tokens: IToken[];
}

export const CopilotChat: React.FC<CopilotChatProps> = ({ instances, tokens }) => {
  const [selectedInstance, setSelectedInstance] = useState<IInstance | undefined>(instances[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const { getActiveServers } = useMcpServers();
  const [sessionEnabledServers, setSessionEnabledServers] = useState<Record<string, boolean>>({});

  // Find the appropriate token for the selected model
  const getTokenForModel = () => {
    const activeToken = tokens.find((t) => t.active);
    return activeToken || tokens[0]; // Fallback
  };

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      instances: instances,
      tokenData: getTokenForModel(),
      allTokens: tokens,
      model: selectedModel,
      mcpServers: getActiveServers().filter((server) => sessionEnabledServers[server.id] === true),
    },
  });

  const [showTools, setShowTools] = useState(false);
  const [availableTools, setAvailableTools] = useState<string[]>([]);

  const PREDEFINED_ASSISTANT_MESSAGE = 'Welcome! I am your personal copilot assistant. How can I help you today?';

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
          content: PREDEFINED_ASSISTANT_MESSAGE,
        },
      ]);
    }
  }, []);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: PREDEFINED_ASSISTANT_MESSAGE,
      },
    ]);
  };

  // Preset message options
  const presetMessages = [
    { label: 'Get Content', value: 'Use <Tool> to do <x>' },
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
            <ModelSelector
              tokens={tokens}
              selectedModel={selectedModel} // Pass the current selected model
              onModelChange={(value: string) => setSelectedModel(value)}
              defaultModel="gpt-4o-mini"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <ChatMessages messages={messages} isLoading={isLoading} />

        <div className="border-t border-border mt-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-background">
            <div className="flex flex-wrap gap-2">
              {presetMessages.map((preset, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 cursor-pointer"
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
                placeholder="Ask 'My Copilot' anything..."
                className="min-h-[90px] max-h-[200px] resize-none px-3 py-2"
                disabled={isLoading}
              />

              {/* MCP Tools Drawer - positioned over textarea */}
              <div className="absolute left-2 bottom-2 z-10">
                <McpToolsDrawer
                  sessionEnabledServers={sessionEnabledServers}
                  setSessionEnabledServers={setSessionEnabledServers}
                  handleToolSelect={handleToolSelect}
                  instances={instances}
                  triggerElement={
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 shadow-sm hover:bg-primary/10 cursor-pointer"
                      aria-label="Show available tools"
                    >
                      <Wrench className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>

              {/* Send button stays on right side */}
              <TooltipProvider>
                <div className="absolute right-2 bottom-2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleClearChat}
                      >
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
