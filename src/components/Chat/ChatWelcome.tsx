import { FC } from 'react';

interface ChatWelcomeProps {}

export const ChatWelcome: FC<ChatWelcomeProps> = () => {
  return (
    <div className="welcome bg-gray-100 p-8 rounded-lg border shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Sitecore Assistant</h1>
      <p className="text-gray-600">
        The Sitecore Assistant is a friendly AI that helps you create and manage Sitecore assets.
      </p>
      <p className="text-gray-600">To get started, type a message in the chat box below.</p>
    </div>
  );
};
