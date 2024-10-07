'use client';

import { useChat } from 'ai/react';
import { FC } from 'react';

interface ChatPageProps {}

const ChatPage: FC<ChatPageProps> = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="chat-container p-4 flex flex-col items-center h-screen">
      <div className="messages flex-grow w-full max-w-2xl mb-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form w-full max-w-2xl sticky bottom-0 bg-white p-4">
        <textarea value={input} onChange={handleInputChange} className="chat-input w-full p-2 border rounded mb-2" />
        <div className="flex justify-end">
          <button type="submit" className="chat-submit bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
