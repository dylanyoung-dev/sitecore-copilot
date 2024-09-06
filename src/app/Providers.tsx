// app/providers.tsx
'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import sitecoreTheme, { toastOptions } from '@sitecore/blok-theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={sitecoreTheme} toastOptions={toastOptions}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
