'use client';

import { useClientContext } from '@/context/ClientContext';

import { FC, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface ClientListProps {}

export const ClientList: FC<ClientListProps> = () => {
  const { clients, addClient, updateClient, removeClient } = useClientContext();
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const organizationRef = useRef<HTMLInputElement>(null);
  const clientIdRef = useRef<HTMLInputElement>(null);
  const clientSecretRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLSelectElement>(null);
  const environmentRef = useRef<HTMLSelectElement>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>(initialClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsDialogOpen(true)
  }

  const handleAddClient = () => {
    setSelectedClient(null)
    setIsDialogOpen(true)
  }

  const handleSaveClient = (updatedClient: Client) => {
    if (selectedClient) {
      setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c))
    } else {
      setClients([...clients, { ...updatedClient, id: clients.length + 1 }])
    }
    setIsDialogOpen(false)
  }

  // useEffect(() => {
  //   if (editingClient !== null && isOpen) {
  //     const client = clients.find((c) => c.clientId === editingClient);
  //     console.log('client', client);
  //     if (client) {
  //       setTimeout(() => {
  //         if (selectedProduct) setSelectedProduct(client.product);
  //         if (organizationRef.current) organizationRef.current.value = client.organizationId;
  //         if (clientIdRef.current) clientIdRef.current.value = client.clientId;
  //         if (clientSecretRef.current) clientSecretRef.current.value = client.clientSecret;
  //         if (regionRef.current) regionRef.current.value = client.region || '';
  //         if (environmentRef.current) environmentRef.current.value = client.environment || '';
  //       }, 0);
  //     }
  //   }
  // }, [isOpen, editingClient, clients]);

  // const handleSubmit = () => {
  //   const product = (selectedProduct as ProductOptions) || ProductOptions.XMCloud;
  //   const organizationId = organizationRef.current?.value || '';
  //   const clientId = clientIdRef.current?.value || '';
  //   const clientSecret = clientSecretRef.current?.value || '';
  //   const region = regionRef.current?.value || '';
  //   const environment = environmentRef.current?.value as EnvironmentOptions;

  //   if (editingClient !== null) {
  //     updateClient(clientId, {
  //       product,
  //       organizationId,
  //       clientId,
  //       clientSecret,
  //       region,
  //       environment,
  //     });
  //   } else {
  //     addClient({
  //       product,
  //       organizationId,
  //       clientId,
  //       clientSecret,
  //       region,
  //       environment,
  //     });
  //   }

  //   onClose();
  //   setEditingClient(null);
  // };

  // const handleDelete = (clientId: string) => {
  //   removeClient(clientId);
  // };

  // const handleEdit = (clientId: string) => {
  //   setEditingClient(clientId);
  //   onOpen();
  // };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientRow key={client.id} client={client} onEdit={handleEditClient} />
          ))}
        </TableBody>
      </Table>
      <ClientDialog
        client={selectedClient}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveClient}
      />
    </div>

      {/* <List spacing="3">
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
                <Text fontWeight="bold">
                  {client.product}{' '}
                  <Badge colorScheme="primary">{client.environment}</Badge>
                </Text>
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
                <Select
                  placeholder="Select product"
                  onChange={handleProductChange}
                >
                  {Object.values(ProductOptions).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="environment">
                <FormLabel>Environment</FormLabel>
                <Select placeholder="Select environment" ref={environmentRef}>
                  {Object.keys(EnvironmentOptions).map((key) => (
                    <option
                      key={key}
                      value={
                        EnvironmentOptions[
                          key as keyof typeof EnvironmentOptions
                        ]
                      }
                    >
                      {key}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {selectedProduct === ProductOptions.PersonalizeCDP && (
                <FormControl id="region">
                  <FormLabel>
                    <HStack alignItems="center">
                      <FormLabel>Region</FormLabel>
                      <Tooltip label="Select the region you are using.">
                        <span>
                          <BsInfoCircle fontSize="16px" />
                        </span>
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Select placeholder="Select region" ref={regionRef}>
                    <option value="us">US</option>
                    <option value="eu">EU</option>
                    <option value="ap">AP</option>
                  </Select>
                </FormControl>
              )}

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
      </Modal> */}
  );
};
