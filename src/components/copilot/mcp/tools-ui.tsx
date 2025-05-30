import React, { useEffect } from 'react';
import { IMcpServer } from '@/models/IMcpServer';
import { IInstance } from '@/models/IInstance';
import { Blocks, Globe2, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useMcpServers } from '@/hooks/use-mcp-servers';

interface McpToolsDrawerProps {
  sessionEnabledServers: Record<string, boolean>;
  setSessionEnabledServers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleToolSelect: (toolName: string) => void;
  triggerElement: React.ReactNode;
  onServersLoaded?: (servers: IMcpServer[]) => void;
  instances: IInstance[];
}

export const McpToolsDrawer: React.FC<McpToolsDrawerProps> = ({
  sessionEnabledServers,
  setSessionEnabledServers,
  handleToolSelect,
  triggerElement,
  onServersLoaded,
  instances,
}) => {
  // Use the hook to load MCP servers
  const { servers, isLoading } = useMcpServers();

  // Check if server is available based on API definition requirements
  const isServerAvailable = (server: IMcpServer): boolean => {
    // If no apiDefinitionId specified, the server is always available
    if (!server.apiDefinitionId) return true;

    // Check if any active instance matches the required API definition
    return instances.some((instance) => instance.isActive && instance.apiDefinitionId === server.apiDefinitionId);
  };

  // Update the enabledMap initialization in useEffect
  useEffect(() => {
    if (servers && servers.length > 0) {
      if (onServersLoaded) {
        onServersLoaded(servers);
      }

      // Initialize enabled servers based on availability
      const enabledMap: Record<string, boolean> = {};
      servers.forEach((server) => {
        if (!server.apiDefinitionId) {
          // Servers without apiDefinitionId should be enabled by default
          enabledMap[server.id] = true;
        } else {
          // For servers with apiDefinitionId, check if a matching instance exists
          const matchingInstances = instances.filter(
            (instance) => instance.isActive && instance.apiDefinitionId === server.apiDefinitionId
          );
          const hasMatchingInstance = matchingInstances.length > 0;
          enabledMap[server.id] = hasMatchingInstance;
        }
      });

      setSessionEnabledServers(enabledMap);
    }
  }, [servers, instances, onServersLoaded, setSessionEnabledServers]);

  // Filter for active servers
  const activeServers = servers?.filter((server) => server.isActive) || [];

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerElement}</SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:w-[450px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Available Tools</SheetTitle>
          <SheetDescription>Enable or disable tools for this session</SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-7rem)] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : activeServers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No tools found.</div>
          ) : (
            <div className="divide-y">
              {activeServers.map((server, idx) => {
                const available = isServerAvailable(server);

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-4 py-3 ${
                      available ? 'hover:bg-muted/50' : 'opacity-60'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 ${available ? 'cursor-pointer' : ''} flex-1`}
                      onClick={() => available && handleToolSelect(server.name)}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                        {server.type === 'http' ? <Globe2 className="h-4 w-4" /> : <Blocks className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                          {!available
                            ? 'Must configure a matching Instance to use MCP Server'
                            : server.description || server.url}
                        </div>

                        {/* Connection status indicators */}
                        {server.apiDefinitionId && (
                          <div
                            className={`text-xs flex items-center gap-1 mt-2 ${
                              available ? 'text-emerald-500' : 'text-red-500'
                            }`}
                          >
                            {available ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  className="lucide lucide-plug-icon lucide-plug h-3 w-3"
                                >
                                  <path d="M12 22v-5" />
                                  <path d="M9 8V2" />
                                  <path d="M15 8V2" />
                                  <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
                                </svg>
                                Instance Available
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Instance Unavailable
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={sessionEnabledServers[server.id] === true}
                      disabled={!available}
                      onCheckedChange={(checked) => {
                        if (available) {
                          setSessionEnabledServers((prev) => ({
                            ...prev,
                            [server.id]: checked,
                          }));
                        }
                      }}
                      aria-label={`Enable ${server.name} for this session`}
                      className="cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Horizontal divider and MCP Server config button */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs w-full"
            onClick={() => (window.location.href = '/settings/mcp')}
          >
            Configure MCP Servers
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
