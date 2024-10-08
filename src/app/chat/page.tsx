'use client';

import { useChat } from 'ai/react';
import { ChevronRight, Code, Loader } from 'lucide-react';
import { FC, useState } from 'react';

interface ChatPageProps {}

const ChatPage: FC<ChatPageProps> = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const triggerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShowWelcome(false);
    handleSubmit();
    setIsLoading(false);
  };

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
    <div className="chat-container p-4 flex h-screen">
      <div
        className={`messages-container flex-grow transition-all duration-500 ${
          isEditorOpen ? 'w-2/3' : 'w-full'
        } flex flex-col items-center`}
      >
        {showWelcome && (
          <div
            className={`welcome-box w-full max-w-4xl mb-4 p-10 rounded-lg bg-gray-100 transition-opacity duration-500`}
          >
            <h1 className="text-xl font-bold mb-4">Welcome to the Sitecore Assistant Chat</h1>
            <p className="text-md">
              This chat is designed to assist you with creating Sitecore assets in the Sitecore SaaS products. Whether
              you have questions, need guidance, or want to start a conversation, feel free to reach out. Our chat is
              powered by advanced AI to provide you with the best possible support.
            </p>
          </div>
        )}

        <div className="messages flex-grow w-full max-w-2xl mb-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg.content}
            </div>
          ))}
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
          <div className="flex justify-end">
            <button
              type="submit"
              className={`chat-submit p-2 rounded-lg border ${
                isLoading ? 'bg-gray-300 text-gray-600' : 'bg-gray-700 text-white'
              }`}
              onClick={() => triggerSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="h-6 w-6 animate-spin" /> : <ChevronRight className="h-6 w-6" />}
            </button>
            <button type="button" onClick={toggleEditor} className="ml-2 p-2 rounded-lg border bg-gray-700 text-white">
              <Code className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
      <div
        className={`editor-view fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transition-transform duration-500 ${
          isEditorOpen ? 'transform translate-x-0' : 'transform translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Editor View</h2>
          <textarea className="w-full h-96 p-2 border rounded"></textarea>
          <button
            type="button"
            onClick={toggleEditor}
            className="mt-4 px-4 py-2 rounded-lg border bg-gray-700 text-white"
          >
            Close Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
