'use client';

import '@/styles/global.css';
import 'highlight.js/styles/default.css';

import { ClientProvider } from '@/providers/ClientCredentials';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProvider>{children}</ClientProvider>;
}
