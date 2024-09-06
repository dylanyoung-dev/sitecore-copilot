'use client';

import { ChatModal } from '@/components/Chat/ChatModal';
import { LeftNavigation } from '@/components/Nav/LeftNavigation';
import { useClientContext } from '@/context/ClientContext';
import { Box, Flex, useColorModeValue as mode } from '@chakra-ui/react';
import { Providers } from './Providers';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { clients } = useClientContext();

  return (
    <html lang="en">
      <body>
        <Providers>
          <Box height="100vh" overflow="hidden" position="relative">
            <Flex h="full" id="app-container">
              <LeftNavigation />
              <Box bg={mode('white', 'gray.800')} flex="1" p="6">
                <Box w="full" h="full" rounded="lg">
                  {children}
                </Box>
              </Box>
            </Flex>

            {/* Chat Modal Button */}
            <ChatModal />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
