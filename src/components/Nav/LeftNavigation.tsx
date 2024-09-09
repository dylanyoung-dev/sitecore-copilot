'use client';

import { useClientContext } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { Box, Circle, Flex, Stack } from '@chakra-ui/react';
import { FC } from 'react';
import {
  BiBuoy,
  BiCog,
  BiCreditCard,
  BiHome,
  BiUserCircle,
} from 'react-icons/bi';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';
import { NavLinkItem } from './NavLinkItem';

interface LeftNavigationProps {}

export const LeftNavigation: FC<LeftNavigationProps> = () => {
  const clientContext = useClientContext();

  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        {/* <AccountSwitcher /> */}
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          <Stack spacing="1">
            <NavLinkItem href="/" icon={<BiHome />} label="Get Started" />
          </Stack>

          {clientContext?.clients?.find(
            (client) => client.product === ProductOptions.XMCloud
          ) && (
            <NavGroup label="XM Cloud">
              <NavLinkItem href="" icon={<BiUserCircle />} label="Recipes" />
              <NavItem icon={<BiCreditCard />} label="Marketplace" />
            </NavGroup>
          )}

          {clientContext?.clients?.find(
            (client) => client.product === ProductOptions.PersonalizeCDP
          ) && (
            <NavGroup label="CDP & Personalize">
              <NavLinkItem href="" icon={<BiUserCircle />} label="Recipes" />
              <NavItem icon={<BiCreditCard />} label="Marketplace" />
            </NavGroup>
          )}
        </Stack>
        <Box>
          <Stack spacing="1">
            <NavLinkItem
              subtle
              icon={<BiCog />}
              href="/settings"
              label="Settings"
            />
            <NavItem
              subtle
              icon={<BiBuoy />}
              label="Help & Support"
              endElement={<Circle size="2" bg="blue.400" />}
            />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};
