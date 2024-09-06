import { Box, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface NavGroupProps {
  label: string;
  children: ReactNode;
}

export const NavGroup: FC<NavGroupProps> = ({ label, children }) => (
  <Box>
    <Text fontSize="xs" fontWeight="bold" color="gray.400" px="4" py="2">
      {label}
    </Text>
    <Stack spacing="1">{children}</Stack>
  </Box>
);
