'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { EditHeadersModal } from '@/components/mcp/edit-headers-modal';
import { AddMcpServerModal, McpServerTable } from '@/components/mcp/mcp-server-ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useInstances } from '@/hooks/use-instances';
import { useTokens } from '@/hooks/use-tokens';
import { HeaderConfig, IMcpServer } from '@/models/IMcpServer';
import { Separator } from '@radix-ui/react-separator';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function McpServerConfigPage() {
  const [servers, setServers] = useState<IMcpServer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeadersModalOpen, setIsHeadersModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<IMcpServer | null>(null);
  const { tokens } = useTokens();
  const { instances } = useInstances();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mcp-servers');
      if (saved) {
        setServers(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading MCP servers:', error);
    }
  }, []);

  const handleAddServer = (newServer: Omit<IMcpServer, 'id'>) => {
    const server: IMcpServer = {
      ...newServer,
      id: crypto.randomUUID(),
    };
    const updatedServers = [...servers, server];
    setServers(updatedServers);
    localStorage.setItem('mcp-servers', JSON.stringify(updatedServers));
    setIsModalOpen(false);
  };

  const handleDeleteServer = (id: string) => {
    const updatedServers = servers.filter((server) => server.id !== id);
    setServers(updatedServers);
    localStorage.setItem('mcp-servers', JSON.stringify(updatedServers));
  };
  const handleToggleActive = (id: string) => {
    const updatedServers = servers.map((server) =>
      server.id === id ? { ...server, isActive: !server.isActive } : server
    );
    setServers(updatedServers);
    localStorage.setItem('mcp-servers', JSON.stringify(updatedServers));
  };

  const handleEditHeaders = (server: IMcpServer) => {
    setSelectedServer(server);
    setIsHeadersModalOpen(true);
  };

  const handleSaveHeaders = (serverId: string, headers: HeaderConfig[]) => {
    const updatedServers = servers.map((server) => (server.id === serverId ? { ...server, headers } : server));
    setServers(updatedServers);
    localStorage.setItem('mcp-servers', JSON.stringify(updatedServers));
    setIsHeadersModalOpen(false);
    setSelectedServer(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Instance Configuration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-6 px-4">
          <div className="border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">MCP Server Configuration</h1>
                <button className="cursor-pointer flex items-center" onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add MCP Server
                </button>
              </div>{' '}
              <AddMcpServerModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddServer} />
              <McpServerTable
                servers={servers}
                onDelete={handleDeleteServer}
                onToggleActive={handleToggleActive}
                onEditHeaders={handleEditHeaders}
              />
              <EditHeadersModal
                open={isHeadersModalOpen}
                onOpenChange={setIsHeadersModalOpen}
                server={selectedServer}
                onSave={handleSaveHeaders}
                tokens={tokens}
                instances={instances}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
