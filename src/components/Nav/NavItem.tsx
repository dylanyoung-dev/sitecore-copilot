import { Box, Flex, Text } from '@chakra-ui/react';
import { FC, ReactElement, ReactNode } from 'react';

interface NavItemProps {
  href?: string;
  label: string;
  subtle?: boolean;
  active?: boolean;
  icon: ReactElement;
  endElement?: ReactElement;
  children?: ReactNode;
}

export const NavItem: FC<NavItemProps> = ({
  icon,
  label,
  active,
  subtle,
  endElement,
}) => (
  <Flex
    align="center"
    px="4"
    py="3"
    cursor="pointer"
    color={active ? 'white' : subtle ? 'gray.400' : 'gray.200'}
    bg={active ? 'gray.700' : 'transparent'}
    _hover={{ bg: 'gray.600', color: 'white' }}
    borderRadius="md"
  >
    {icon && <Box mr="3">{icon}</Box>}
    <Text flex="1">{label}</Text>
    {endElement}
  </Flex>
);
