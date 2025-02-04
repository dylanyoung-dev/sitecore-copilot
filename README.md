# Sitecore Assistant

Building a local-based (or hosted) app that users can configure for their Cloud Portal environment to handle advanced use cases.

## Setting Up the Solution

1. Clone the repository
2. In a Terminal in the Root of the project, run `npm install`
3. Clone and rename the `.env.example` file to `.env`
4. Fill in the `.env` file with the appropriate values

> Currently the only environment variable is for Open AI, if you don't plan on running the API functionality, you can leave this blank and it'll disable that functionality

5. Run `npm run dev` to start the development server

## Using the App

The application runs locally on `localhost:3000` by default. You can access the app by navigating to that URL in your browser. Once you are in the app, you can configure access to your Sitecore Cloud environment by navigating to the settings page and filling in the appropriate values. Currently the app only supports Sitecore CDP/Personalize but more integrations are coming soon.

The thought is that anyone can use this tool locally to perform pre-built actions on their Sitecore environment. Also this provides an `Accelerator` for developers to build out more advanced use cases.
