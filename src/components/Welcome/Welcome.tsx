export const Welcome = () => {
  return (
    <>
      <div className="welcome-box w-full max-w-4xl mb-4 p-10 rounded-lg bg-gray-100">
        <h1 className="text-xl font-bold mb-4">Welcome to the Sitecore Assistant Chat</h1>
        <p className="text-md mb-4">
          This chat is designed to assist you with creating Sitecore assets in the Sitecore SaaS products. Whether you
          have questions, need guidance, or want to start a conversation, feel free to reach out. Our chat is powered by
          Vercel AI SDK with OpenAI.
        </p>
        <h2 className="text-lg font-semibold mb-2">Getting Started:</h2>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">Create a new Sitecore client.</li>
          <li className="mb-2">Start doing some mumbo jumbo.</li>
        </ol>
      </div>
    </>
  );
};
