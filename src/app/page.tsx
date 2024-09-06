'use client';
import { Button, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Welcome to Sitecore Assistant
      </Heading>
      <Text fontSize="lg" mb={4}>
        This app is disabled until you configure a Sitecore connection client.
        To get started click here:
      </Text>
      <Button as="a" href="/settings" ml={2}>
        Sitecore Configuration
      </Button>
    </>
  );
}
