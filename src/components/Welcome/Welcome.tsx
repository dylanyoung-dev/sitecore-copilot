export const Welcome = () => {
  return (
    <>
      <div className="welcome-box w-full max-w-4xl mb-4 p-10 rounded-lg bg-gray-100">
        <h1 className="text-xl font-bold mb-4">Personalize Assistant</h1>
        <p className="text-md mb-4">
          This is a Proof of Concept for Sitecore Personalize Assistant slated for Sitecore Marketplace. Goal is to make
          creating experiences in Sitecore Personalize much easier.
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
