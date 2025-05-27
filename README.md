# Sitecore Copilot

A hosted Copilot for Sitecore developers/marketers. Right now, this is just a playground for me to test out various AI development ideas or POCs. Where is this headed? Who knows! But I will create blogs/videos along the way to showoff the innovation. Currently it's open source, especially since all this application requires is the hosting of this app, and it's the responsibility of the user to provide their own API/Instances etc. keys to use the app. I do see a future where there are more Agentic or RAG usecases where there could be paid features to this app, but for now, enjoy and feel free to let me know if you have any questions or suggestions.

View the App: https://copilot.dylanyoung.dev/.

## Features

Currently this app is driven around Sitecore, but eventually I'm going to grow this beyond just Sitecore use cases. Current capabilities include:

- MCP Remote Server Integrations (only SSE or HTTP supported, since this is a hosted application)
- Choice of AI Models

## Features in the Works

- Specific Sitecore Use Case (with multiple environments with full MCP/LLM integration)
- Long Term Memory/Grounding capabilities with RAG
- Ways to save and load your keys
- Agent Workflows
- More AI Models
- Agentic UI Capabilities
- More Integrations
- Sitecore Personalize (Long Term Memory use cases for the current user on the app)

For a full list of features, please see the [issues](https://github.com/dylanyoung-dev/sitecore-copilot/issues).

## Security

All keys and integrations are stored in local storage, which means we do not store any of your keys or integrations on our servers. This is a security feature to ensure that your keys and integrations are not exposed to anyone else. However, this also means that if you clear your local storage, you will lose all of your keys and integrations. Please make sure to back up your keys and integrations before clearing your local storage.
