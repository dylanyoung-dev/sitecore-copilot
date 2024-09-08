import { ClientList } from '@/components/Clients/ClientList';
import { Heading, Text } from '@chakra-ui/react';

export default function Settings() {
  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Settings
      </Heading>
      <Text fontSize="lg" mb={4}>
        Configure your Sitecore connection client.
      </Text>

      <ClientList />
    </>
  );
}
