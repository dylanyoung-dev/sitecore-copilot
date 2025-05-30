import React, { useEffect } from 'react';
import { IMcpServer } from '@/models/IMcpServer';
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
}

export const McpToolsDrawer: React.FC<McpToolsDrawerProps> = ({
  sessionEnabledServers,
  setSessionEnabledServers,
  handleToolSelect,
  triggerElement,
  onServersLoaded,
}) => {
  // Use the hook to load MCP servers
  const { servers, isLoading } = useMcpServers();

  // Notify parent when servers are loaded
  useEffect(() => {
    if (servers && servers.length > 0 && onServersLoaded) {
      onServersLoaded(servers);

      // Initialize enabled servers
      const enabledMap: Record<string, boolean> = {};
      servers.forEach((server) => {
        enabledMap[server.id] = server.isActive;
      });
      setSessionEnabledServers(enabledMap);
    }
  }, [servers, onServersLoaded, setSessionEnabledServers]);

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
              {activeServers.map((server, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => handleToolSelect(server.name)}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                      {server.type === 'http' ? <Globe2 className="h-4 w-4" /> : <Blocks className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{server.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[240px]">
                        {server.description || server.url}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={sessionEnabledServers[server.id] ?? false}
                    onCheckedChange={(checked) => {
                      setSessionEnabledServers((prev) => ({
                        ...prev,
                        [server.id]: checked,
                      }));
                    }}
                    aria-label={`Enable ${server.name} for this session`}
                  />
                </div>
              ))}
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
