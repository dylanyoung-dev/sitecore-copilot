import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FC, ReactElement, ReactNode } from 'react';

interface NavLinkItemProps {
  href: string;
  label: string;
  subtle?: boolean;
  active?: boolean;
  icon: ReactElement;
  endElement?: ReactElement;
  children?: ReactNode;
}

export const NavLinkItem: FC<NavLinkItemProps> = ({
  icon,
  label,
  active,
  subtle,
  href,
  endElement,
}) => (
  <Link href={href}>
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
      <Text flex="1" fontSize="lg">
        {label}
      </Text>
      {endElement}
    </Flex>
  </Link>
);
