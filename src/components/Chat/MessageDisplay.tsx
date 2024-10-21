import { Message } from 'ai';
import { Brain, CircleUser } from 'lucide-react';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../CodeBlock/CodeBlock';

interface MessageDisplayProps {
  messages: Message[];
}

export const MessageDisplay: FC<MessageDisplayProps> = ({ messages }) => {
  return (
    <>
      {messages.map((msg, index) => (
        <div key={index} className="relative w-full mb-4">
          <div className="border absolute top-0 left-0 p-2 rounded-md">
            {msg.role === 'user' ? (
              <CircleUser className="h-6 w-6 text-gray-500" />
            ) : (
              <>
                <Brain className="h-6 w-6 text-green-500" />
              </>
            )}
          </div>
          <div className="message bg-gray-100 p-4 rounded-lg border ml-16">
            {msg.content && typeof msg.content === 'string' && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => <table className="my-2 border border-gray-300" {...props} />,
                  thead: ({ node, ...props }) => <thead {...props} />,
                  tbody: ({ node, ...props }) => <tbody {...props} />,
                  tr: ({ node, ...props }) => <tr {...props}>{props.children}</tr>,
                  th: ({ node, ...props }) => <th {...props} />,
                  td: ({ node, ...props }) => <td {...props} />,
                  code: ({ node, ...props }) => {
                    const language = props.className?.replace('language-', '') || '';
                    return !(props as any).inline ? (
                      <div className="my-4">
                        <CodeBlock code={String(props.children).trim()} language={language} />
                      </div>
                    ) : (
                      <code className="bg-gray-100 p-1 rounded-md">{props.children}</code>
                    );
                  },
                  ol: ({ children }) => <ol className="pl-4 list-disc my-4">{children}</ol>,
                  ul: ({ children }) => <ul className="pl-4 my-4">{children}</ul>,
                  li: ({ children }) => <li className="mb-2 ml-4">{children}</li>,
                  p: ({ children }) => <p>{children}</p>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}

            {msg.toolInvocations && (
              <div className="flex flex-col gap-4">
                {msg.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  console.log(toolName);

                  if (state === 'result') {
                    const { result } = toolInvocation;

                    return (
                      <div key={toolCallId}>
                        {toolName === 'createPersonalizeExperience' ? (
                          <>Create Experience</>
                        ) : toolName === 'previewPersonalizeExperience' ? (
                          <>{JSON.stringify(result, null, 2)}</>
                        ) : (
                          <div>{JSON.stringify(result, null, 2)}</div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div key={toolCallId} className="skeleton">
                        {toolName === 'createPersonalizeExperience' ? (
                          <>Create Experience</>
                        ) : toolName === 'previewPersonalizeExperience' ? (
                          <>Preview Experience</>
                        ) : null}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
