import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Power, Settings, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import { IMcpServer } from '@/models/IMcpServer';

interface McpServerTableProps {
  servers: IMcpServer[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onEditHeaders?: (server: IMcpServer) => void;
}

export const McpServerTable: FC<McpServerTableProps> = ({ servers, onDelete, onToggleActive, onEditHeaders }) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setTogglingId(id);
    onToggleActive(id);
    setTogglingId(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Security</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No MCP servers configured.
            </TableCell>
          </TableRow>
        ) : (
          servers.map((server) => (
            <TableRow key={server.id}>
              <TableCell>{server.name}</TableCell>
              <TableCell>{server.url}</TableCell>
              <TableCell className="uppercase">{server.type}</TableCell>
              <TableCell>
                <Badge variant={server.security === 'open' ? 'default' : 'secondary'}>{server.security}</Badge>
              </TableCell>
              <TableCell>
                {server.isActive ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={togglingId === server.id}
                      onClick={() => handleToggleActive(server.id)}
                      aria-label={server.isActive ? 'Deactivate MCP Server' : 'Activate MCP Server'}
                    >
                      <Power className="h-4 w-4 text-black" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{server.isActive ? 'Deactivate' : 'Activate'}</TooltipContent>
                </Tooltip>
                {onEditHeaders && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditHeaders(server)}
                        aria-label="Edit Headers"
                      >
                        <Settings className="h-4 w-4 text-black" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Edit Headers</TooltipContent>
                  </Tooltip>
                )}
                <Button variant="ghost" size="icon" onClick={() => onDelete(server.id)} aria-label="Delete MCP Server">
                  <Trash2 className="h-4 w-4 text-black" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
