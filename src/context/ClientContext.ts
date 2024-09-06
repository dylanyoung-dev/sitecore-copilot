'use client';
import { createContext, useContext } from 'react';

export interface ClientData {
  product: 'XM Cloud' | 'Personalize/CDP' | 'Content Hub One';
  organizationId: string;
  clientId: string;
  clientSecret: string;
}

export interface ClientContextType {
  clients: ClientData[];
  addClient: (client: ClientData) => void;
  removeClient: (product: string, organizationId: string) => void;
}

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
);

export const useClientContext = () => {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
