'use client';

import { useClientContext } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { Box, Circle, Flex, Stack } from '@chakra-ui/react';
import { FC } from 'react';
import { BiBuoy, BiCog, BiCreditCard, BiHome, BiUserCircle } from 'react-icons/bi';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';
import { NavLinkItem } from './NavLinkItem';

interface LeftNavigationProps {}

export const LeftNavigation: FC<LeftNavigationProps> = () => {
  const clientContext = useClientContext();

  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          <Stack spacing="1">
            <NavLinkItem href="/" icon={<BiHome fontSize="20px" />} label="Get Started" />
            <NavLinkItem href="/recipes" icon={<BiCreditCard fontSize="20px" />} label="Recipes" />
          </Stack>
          {clientContext?.clients?.find((client) => client.product === ProductOptions.XMCloud) && (
            <NavGroup label="XM Cloud: Content">
              <NavLinkItem href="" icon={<BiUserCircle fontSize="20px" />} label="Recipes" />
              <NavItem icon={<BiCreditCard fontSize="20px" />} label="Marketplace" />
            </NavGroup>
          )}
          {clientContext?.clients?.find((client) => client.product === ProductOptions.PersonalizeCDP) && (
            <NavGroup label="CDP & Personalize">
              <NavLinkItem href="/personalize/migrate" icon={<BiUserCircle fontSize="20px" />} label="Migrate Assets" />
            </NavGroup>
          )}
        </Stack>
        <Box>
          <Stack spacing="1">
            <NavLinkItem subtle icon={<BiCog fontSize="20px" />} href="/settings" label="Settings" />
            <NavItem
              subtle
              icon={<BiBuoy fontSize="20px" />}
              label="Help & Support"
              endElement={<Circle size="2" bg="blue.400" />}
            />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
