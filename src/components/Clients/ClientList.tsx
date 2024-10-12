'use client';

import { ClientData, useClientContext } from '@/context/ClientContext';

import { Plus } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table';
import { ClientDialog } from './ClientDialog';
import { ClientRow } from './ClientRow';

interface ClientListProps {}

export const ClientList: FC<ClientListProps> = () => {
  const { clients, addClient, updateClient, removeClient } = useClientContext();

  const [editingClient, setEditingClient] = useState<ClientData | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClient = (client: ClientData) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const handleSaveClient = (updatedClient: ClientData) => {
    setIsDialogOpen(false);
  };

  const handleDelete = (clientId: string) => {
    removeClient(clientId);
  };

  return (
    <>
      <div className="flex justify-end items-center mb-6">
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Id</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientRow key={client.clientId} client={client} onEdit={handleEditClient} />
          ))}
        </TableBody>
      </Table>
      <ClientDialog
        client={editingClient}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveClient}
      />
    </>
  );
};
