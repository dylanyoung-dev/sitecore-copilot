'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type StorageData = {
  [key: string]: any[];
};

interface StorageContextType {
  getData: <T>(key: string) => T[];
  setData: <T>(key: string, data: T[]) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [storage, setStorage] = useState<StorageData>({
    instances: [],
    mcpServers: [],
    tokens: [],
  });

  // Load all stored data on mount
  useEffect(() => {
    const keys = ['instances', 'mcpServers', 'tokens'];
    const loadedData: StorageData = {};

    keys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) loadedData[key] = JSON.parse(data);
      } catch (error) {
        console.error(`Error loading ${key} data:`, error);
      }
    });

    setStorage((prev) => ({ ...prev, ...loadedData }));
  }, []);

  // Generic getter
  const getData = <T,>(key: string): T[] => {
    return (storage[key] || []) as T[];
  };

  // Generic setter
  const setData = <T,>(key: string, data: T[]): void => {
    setStorage((prev) => ({ ...prev, [key]: data }));
    localStorage.setItem(key, JSON.stringify(data));
  };

  return <StorageContext.Provider value={{ getData, setData }}>{children}</StorageContext.Provider>;
}

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
