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
      return storedClients ? JSON.parse(storedClients) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('clients', JSON.stringify(clients));
    }
  }, [clients]);

  const addClient = (client: ClientData) => {
    setClients((prevClients) => [...prevClients, client]);
  };

  const removeClient = (product: string, organizationId: string) => {
    setClients((prevClients) =>
      prevClients.filter(
        (client) =>
          client.product !== product || client.organizationId !== organizationId
      )
    );
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, removeClient }}>
      {children}
    </ClientContext.Provider>
  );
};
