# My Copilot

A hosted Copilot for Anyone (though originally built for Sitecore use cases, but spreading our wings paste Sitecore now). Right now, this is just a playground for me to test out various AI development ideas or POCs. Where is this headed? Who knows! But I will create blogs/videos along the way to showoff the innovation. Currently it's open source, especially since all this application requires is the hosting of this app, and it's the responsibility of the user to provide their own API/Instances etc. keys to use the app. I do see a future where there are more Agentic or RAG usecases where there could be paid features to this app, but for now, enjoy and feel free to let me know if you have any questions or suggestions.

View the App: https://copilot.dylanyoung.dev/.

## Features

Currently this app is driven around Sitecore, but eventually I'm going to grow this beyond just Sitecore use cases. Current capabilities include:

- MCP Remote Server Integrations (only SSE or HTTP supported, since this is a hosted application)
- Choice of AI Models (currently only OpenAI and Claude, but more to come)

## Features in the Works

- Specific Sitecore Use Cases
- Add OAUTH for MCP Remote Server Integrations (support for Atlassian, Microsoft, etc.)
- Long Term Memory/Grounding capabilities with RAG
- BYOA (Bring Your Own Agent) capabilities
- More AI Models
- Agentic UI Capabilities
- BYOM (Bring Your Own Model) Capabilities
- Sitecore Personalize (Long Term Memory use cases for the current user on the app)

For a full list of features, please see the [issues](https://github.com/dylanyoung-dev/sitecore-copilot/issues).

## Security

All keys and integrations are stored in local storage, which means we do not store any of your keys or integrations on our servers. This is a security feature to ensure that your keys and integrations are not exposed to anyone else. However, this also means that if you clear your local storage, you will lose all of your keys and integrations. Please make sure to back up your keys and integrations before clearing your local storage.

## Local Development Instructions

To set up the application locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/dylanyoung-dev/sitecore-copilot.git
   cd sitecore-copilot
   ```
2. **Install Dependencies**
   Make sure you have Node.js and npm installed, then run:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_LANGFUSE_SECRET_KEY=your_langfuse_secret_key
   NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
   NEXT_PUBLIC_LANGFUSE_HOST=your_langfuse_host
   NEXT_PUBLIC_GTM_ID=your_gtm_id
   ```
4. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   ```
5. **Access the Application**
   Open your web browser and navigate to `http://localhost:3000`.
