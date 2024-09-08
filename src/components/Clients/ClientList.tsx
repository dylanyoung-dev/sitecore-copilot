'use client';

import { useClientContext } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

interface ClientListProps {}

export const ClientList: FC<ClientListProps> = () => {
  const { clients, addClient, updateClient, removeClient } = useClientContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const productRef = useRef<HTMLSelectElement>(null);
  const organizationRef = useRef<HTMLInputElement>(null);
  const clientIdRef = useRef<HTMLInputElement>(null);
  const clientSecretRef = useRef<HTMLInputElement>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);

  useEffect(() => {
    if (editingClient !== null && isOpen) {
      const client = clients.find((c) => c.clientId === editingClient);
      console.log('client', client);
      if (client) {
        setTimeout(() => {
          if (productRef.current) productRef.current.value = client.product;
          if (organizationRef.current)
            organizationRef.current.value = client.organizationId;
          if (clientIdRef.current) clientIdRef.current.value = client.clientId;
          if (clientSecretRef.current)
            clientSecretRef.current.value = client.clientSecret;
        }, 0);
      }
    }
  }, [isOpen, editingClient, clients]);

  const handleSubmit = () => {
    const product =
      (productRef.current?.value as ProductOptions) || ProductOptions.XMCloud;
    const organizationId = organizationRef.current?.value || '';
    const clientId = clientIdRef.current?.value || '';
    const clientSecret = clientSecretRef.current?.value || '';

    if (editingClient !== null) {
      updateClient(clientId, {
        product,
        organizationId,
        clientId,
        clientSecret,
      });
    } else {
      addClient({ product, organizationId, clientId, clientSecret });
    }

    onClose();
    setEditingClient(null);
  };

  const handleDelete = (clientId: string) => {
    removeClient(clientId);
  };

  const handleEdit = (clientId: string) => {
    setEditingClient(clientId);
    onOpen();
  };

  return (
    <Box p="4" bg="gray.100" borderRadius="md">
      <Flex justify="space-between" align="center" mb="10">
        <Text fontSize="xl">Configured Clients</Text>
        <Button colorScheme="primary" onClick={onOpen}>
          Add Client
        </Button>
      </Flex>
      <List spacing="3">
        {clients.map((client, index) => (
          <ListItem
            key={index}
            p={4}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">{client.product}</Text>
                <Text>{client.organizationId}</Text>
              </Box>
              <HStack>
                <Button
                  size="sm"
                  colorScheme="primary"
                  onClick={() => handleEdit(client.clientId)}
                >
                  Edit
                </Button>
                <IconButton
                  aria-label="Delete client"
                  icon={<FaTrash />}
                  colorScheme="primary"
                  size="sm"
                  onClick={() => handleDelete(client.clientId)}
                />
              </HStack>
            </Flex>
          </ListItem>
        ))}
      </List>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              Fill in the details below to add a new client to the list.
            </Text>
            <Text>
              Note: Client information is stored only in your local storage in
              your browser.
            </Text>
            <Divider my={4} />
            <VStack spacing={4}>
              <FormControl id="product" mb={4}>
                <FormLabel>
                  <HStack alignItems="center">
                    <FormLabel>Product</FormLabel>
                    <Tooltip label="Select the product you are using.">
                      <span>
                        <BsInfoCircle fontSize="16px" />
                      </span>
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Select placeholder="Select product" ref={productRef}>
                  {Object.values(ProductOptions).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="organizationId">
                <FormLabel>
                  <Tooltip label="Enter your organization ID. More info at <Link href='https://example.com/organization-id' isExternal>Organization ID</Link>">
                    <span>Organization ID</span>
                  </Tooltip>
                </FormLabel>
                <Input ref={organizationRef} />
              </FormControl>
              <FormControl id="clientId">
                <FormLabel>Client ID</FormLabel>
                <Input
                  ref={clientIdRef}
                  readOnly={editingClient !== null}
                  type="password"
                />
              </FormControl>
              <FormControl id="clientSecret">
                <FormLabel>Client Secret</FormLabel>
                <Input ref={clientSecretRef} type="password" />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onClose();
                setEditingClient(null);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
