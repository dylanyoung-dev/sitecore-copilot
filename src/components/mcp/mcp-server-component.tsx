'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { EditHeadersModal } from '@/components/mcp/modals/edit-headers';
import { AddMcpServerModal } from '@/components/mcp/modals/add-mcp-server';
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
import { useMcpServers } from '@/hooks/use-mcp-servers';
import { Separator } from '@radix-ui/react-separator';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { IMcpServer } from '@/models/IMcpServer';
import { IHeaderConfig } from '@/models/IHeaderConfig';
import { McpServerTable } from './ui/table';

export default function McpServerComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeadersModalOpen, setIsHeadersModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<IMcpServer | null>(null);
  const { tokens } = useTokens();
  const { instances } = useInstances();

  const { servers, isLoading, addServer, deleteServer, toggleServerActive, updateServerHeaders } = useMcpServers();

  const handleAddServer = (newServer: Omit<IMcpServer, 'id'>) => {
    addServer(newServer);
    setIsModalOpen(false);
  };

  const handleDeleteServer = (id: string) => {
    deleteServer(id);
  };

  const handleToggleActive = (id: string) => {
    toggleServerActive(id);
  };

  const handleEditHeaders = (server: IMcpServer) => {
    setSelectedServer(server);
    setIsHeadersModalOpen(true);
  };

  const handleSaveHeaders = (serverId: string, headers: IHeaderConfig[]) => {
    updateServerHeaders(serverId, headers);
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
                <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add MCP Server
                </Button>
              </div>
              {isLoading ? (
                <div className="py-4 text-center">Loading servers...</div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
