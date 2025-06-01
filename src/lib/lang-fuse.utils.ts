import { Langfuse } from 'langfuse';

// Use environment variables for keys
export const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY || '',
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
  baseUrl: 'https://us.cloud.langfuse.com',
});
