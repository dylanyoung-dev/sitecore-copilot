'use client';

import { ClientProvider } from '@/providers/ClientCredentials';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import sitecoreTheme, { toastOptions } from '@sitecore/blok-theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={sitecoreTheme} toastOptions={toastOptions}>
        <ClientProvider>{children}</ClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
