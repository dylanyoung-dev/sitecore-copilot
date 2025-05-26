'use client';

import { IHeaderConfig } from '@/models/IHeaderConfig';
import { IMcpServer } from '@/models/IMcpServer';
import { IYamlServerConfig } from '@/models/IYamlConfig';
import { loadMcpServersConfigClient } from '@/utils/yamlUtils';
import { useEffect, useState } from 'react';

export function useMcpServers() {
  const [servers, setServers] = useState<IMcpServer[]>([]);
  const [preconfiguredServers, setPreconfiguredServers] = useState<IYamlServerConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const LOCAL_STORAGE_KEY = 'mcp-servers';
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setServers(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading MCP servers:', error);
    }

    // Load preconfigured servers from YAML
    const loadPreconfiguredServers = async () => {
      setIsLoading(true);
      try {
        const config = await loadMcpServersConfigClient();
        setPreconfiguredServers(config.servers);
      } catch (err) {
        console.error('Error loading preconfigured MCP servers:', err);
        setError('Failed to load preconfigured servers');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreconfiguredServers();
  }, []);

  const addServer = (server: Omit<IMcpServer, 'id'>) => {
    const newServer = {
      ...server,
      id: crypto.randomUUID(),
    };
    const updatedServers = [...servers, newServer];
    setServers(updatedServers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedServers));
    return newServer;
  };

  const deleteServer = (id: string) => {
    const updatedServers = servers.filter((server) => server.id !== id);
    setServers(updatedServers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedServers));
  };

  const toggleServerActive = (id: string) => {
    const updatedServers = servers.map((server) =>
      server.id === id ? { ...server, isActive: !server.isActive } : server
    );
    setServers(updatedServers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedServers));
    return updatedServers.find((server) => server.id === id);
  };

  const updateServerHeaders = (serverId: string, headers: IHeaderConfig[]) => {
    const updatedServers = servers.map((server) => (server.id === serverId ? { ...server, headers } : server));
    setServers(updatedServers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedServers));
    return updatedServers.find((server) => server.id === serverId);
  };

  const getActiveServers = () => {
    return servers.filter((server) => server.isActive);
  };

  const getServerById = (id: string) => {
    return servers.find((server) => server.id === id);
  };
  return {
    servers,
    preconfiguredServers,
    isLoading,
    error,
    addServer,
    deleteServer,
    toggleServerActive,
    updateServerHeaders,
    getActiveServers,
    getServerById,
  };
}
