'use client';
import { ClientContext, ClientData } from '@/context/ClientContext';
import { FC, ReactNode, useEffect, useState } from 'react';

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<ClientData[]>(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedClients = sessionStorage.getItem('clients');
      console.log('storedClients', storedClients);
      return storedClients ? JSON.parse(storedClients) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      console.log('Updating clients in session storage', clients);
      window.sessionStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (client: ClientData) => {
    setClients((prevClients) => [...prevClients, client]);
  };

  const removeClient = (clientId: string) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.clientId !== clientId)
    );
  };

  const updateClient = (clientId: string, updatedClient: ClientData) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.clientId === clientId ? updatedClient : client
      )
    );
  };

  return (
    <ClientContext.Provider
      value={{ clients, addClient, removeClient, updateClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};
