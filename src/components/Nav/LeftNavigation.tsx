'use client';

import { useClientContext } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { Box, Circle, Flex, Stack } from '@chakra-ui/react';
import { FC } from 'react';
import {
  BiBuoy,
  BiCog,
  BiCreditCard,
  BiEnvelope,
  BiHome,
  BiNews,
  BiPurchaseTagAlt,
  BiRecycle,
  BiRedo,
  BiUserCircle,
  BiWallet,
} from 'react-icons/bi';
import { NavGroup } from './NavGroup';
import { NavItem } from './NavItem';

interface LeftNavigationProps {}

export const LeftNavigation: FC<LeftNavigationProps> = () => {
  //const router = useRouter();
  //const { pathname } = router;
  const clientContext = useClientContext();

  //const isActive = (path: string) => pathname.startsWith(path);

  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        {/* <AccountSwitcher /> */}
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          <Stack spacing="1">
            <NavItem active={false} icon={<BiHome />} label="Get Started" />
          </Stack>

          {clientContext?.clients?.find(
            (client) => client.product === ProductOptions.XMCloud
          ) && (
            <NavGroup label="XM Cloud">
              <NavItem icon={<BiCreditCard />} label="Transactions" />
              <NavItem icon={<BiUserCircle />} label="Customers" />
              <NavItem icon={<BiWallet />} label="Income" />
              <NavItem icon={<BiRedo />} label="Transfer" />
            </NavGroup>
          )}

          {clientContext?.clients?.find(
            (client) => client.product === ProductOptions.PersonalizeCDP
          ) && (
            <NavGroup label="CDP & Personalize">
              <NavItem icon={<BiNews />} label="Payment Pages" />
              <NavItem icon={<BiEnvelope />} label="Invoices" />
              <NavItem icon={<BiPurchaseTagAlt />} label="Plans" />
              <NavItem icon={<BiRecycle />} label="Subscription" />
            </NavGroup>
          )}
        </Stack>
        <Box>
          <Stack spacing="1">
            <NavItem
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
