import React, { useRef, useEffect } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message } from 'ai';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
  );
};
