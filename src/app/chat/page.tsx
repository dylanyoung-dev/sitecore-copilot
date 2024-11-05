'use client';

import { ChatWelcome } from '@/components/Chat/ChatWelcome';
import { MessageDisplay } from '@/components/Chat/MessageDisplay';
import { useScrollToBottom } from '@/components/Chat/ScrollToBottom';
import { PersonalizeEditorView } from '@/components/Personalize/PersonalizeEditorView';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import { ArrowUpRight, ChevronRight, Code, Loader } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface ChatPageProps {}

export interface IPersonalizeCreateArgs {
  assets: {
    html: string;
    css: string;
    js: string;
  };
  //templateVars: Record<string, string>;
}

const ChatPage: FC<ChatPageProps> = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [personalizeArgs, setPersonalizeArgs] = useState<IPersonalizeCreateArgs | undefined>();

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  const triggerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowWelcome(false);
    handleSubmit();
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.toolInvocations) {
        const previewPersonalizeExperienceInvocation = lastMessage.toolInvocations.find(
          (invocation) => invocation.toolName === 'previewPersonalizeExperience'
        );

        if (previewPersonalizeExperienceInvocation && previewPersonalizeExperienceInvocation.state === 'result') {
          setIsEditorOpen(true);

          console.log(JSON.stringify(previewPersonalizeExperienceInvocation.args, null, 2));
        }
      }
    }
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      triggerSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  return (
    <div className="chat-container p-4 flex h-screen relative">
      <div className={`messages-container ${isEditorOpen ? 'w-2/3' : 'w-full'} flex-col items-center flex`}>
        {showWelcome && <ChatWelcome />}

        <div
          className="messages w-full flex-grow max-w-3xl mb-4 overflow-y-auto overflow-x-hidden"
          ref={messagesContainerRef}
        >
          <MessageDisplay messages={messages} />
          {error && <div className="bg-red-100 p-2 rounded-lg border text-red-700">{error.message}</div>}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
            </div>
          )}
          <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="chat-form w-full max-w-4xl sticky bottom-0 bg-gray-100 p-4 rounded-lg border"
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="chat-input w-full p-2 rounded mb-2 h-50 border-none bg-gray-100 resize-none focus:outline-none"
            placeholder="Ask the Sitecore Assistant to help you create assets in Sitecore..."
          ></textarea>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Create a personalized experience' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Create a personalize experience <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Create content in XM Cloud' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Create content in XM Cloud <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Get a List of Experiences' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Get a List of Experiences <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`chat-submit p-2 rounded-lg border ${
                  isLoading ? 'bg-gray-300 text-gray-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                onClick={() => triggerSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 " />}
              </button>
              <button
                type="button"
                onClick={toggleEditor}
                className="ml-1 p-2 rounded-lg border bg-gray-700 text-white"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {isEditorOpen && <PersonalizeEditorView toggleEditor={toggleEditor} results={personalizeArgs} />}
    </div>
  );
};

export default ChatPage;
