import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { IMcpServer } from '@/models/IMcpServer';
import { ChevronLeft, Power, Server, Settings, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

interface AddMcpServerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (server: Omit<IMcpServer, 'id'>) => void;
}

// Pre-configured server options (add/edit as needed)
const PRECONFIGURED_SERVERS = [
  {
    label: 'Sitecore (Unofficial)',
    name: 'Sitecore',
    url: 'https://sitecore-mcp-remote-server.dylany.workers.dev/sse',
    type: 'sse',
    security: 'open',
    description: 'Unofficial Sitecore MCP (Remote) Server hosted on Cloudflare Workers',
  },
  {
    label: 'Fetch (Official)',
    name: 'Fetch',
    url: 'https://remote.mcpservers.org/fetch/mcp',
    type: 'http',
    security: 'open',
    description: 'Official Fetch MCP server for web content retrieval',
  },
];

type ModalMode = 'selection' | 'preconfigured' | 'custom';

const AddMcpServerModal: FC<AddMcpServerModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [mode, setMode] = useState<ModalMode>('selection');
  const [form, setForm] = useState<Omit<IMcpServer, 'id'>>({
    name: '',
    url: '',
    security: 'open',
    type: 'http',
    isActive: true,
  });

  // Reset when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMode('selection');
      setForm({ name: '', url: '', security: 'open', type: 'http', isActive: true });
    }
    onOpenChange(newOpen);
  };

  // Handle preconfigured server selection
  const handlePreconfiguredSelect = (server: (typeof PRECONFIGURED_SERVERS)[0]) => {
    onSubmit({
      name: server.name,
      url: server.url,
      type: server.type as 'http' | 'sse',
      security: server.security as 'open' | 'oauth',
      isActive: true,
    });
    handleOpenChange(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.security === 'oauth') {
      alert('OAuth is currently disabled and coming soon. Please use open security for now.');
      return;
    }
    onSubmit(form);
    handleOpenChange(false);
  };

  const renderContent = () => {
    switch (mode) {
      case 'selection':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setMode('preconfigured')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Server className="h-8 w-8 mb-3 mx-auto text-gray-600 group-hover:text-blue-600" />
              <h3 className="font-semibold mb-1">Preconfigured</h3>
              <p className="text-sm text-gray-600">Choose from available MCP servers</p>
            </button>
            <button
              onClick={() => setMode('custom')}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <Settings className="h-8 w-8 mb-3 mx-auto text-gray-600 group-hover:text-green-600" />
              <h3 className="font-semibold mb-1">Custom</h3>
              <p className="text-sm text-gray-600">Configure your own MCP server</p>
            </button>
          </div>
        );

      case 'preconfigured':
        return (
          <div className="space-y-3">
            <Button variant="ghost" size="sm" onClick={() => setMode('selection')} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {PRECONFIGURED_SERVERS.map((server) => (
              <div
                key={server.label}
                onClick={() => handlePreconfiguredSelect(server)}
                className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{server.label}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {server.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {server.security}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{server.description}</p>
                <p className="text-xs text-gray-500 font-mono">{server.url}</p>
              </div>
            ))}
          </div>
        );

      case 'custom':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode('selection')} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Server Name</label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="My MCP Server" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Server URL</label>
                <Input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://example.com/mcp"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="http">HTTP</option>
                    <option value="sse">SSE</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Security</label>
                  <select
                    name="security"
                    value={form.security}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="open">Open</option>
                    <option value="oauth">OAuth</option>
                  </select>
                </div>
              </div>

              {form.security === 'oauth' && (
                <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded p-2">
                  OAuth is currently disabled and coming soon.
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Add Server
            </Button>
          </form>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add MCP Server</DialogTitle>
          <DialogDescription>
            {mode === 'selection' && 'Choose how you want to add a new MCP server.'}
            {mode === 'preconfigured' && 'Select from available preconfigured servers.'}
            {mode === 'custom' && 'Configure your own Model Context Protocol server.'}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

interface McpServerTableProps {
  servers: IMcpServer[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const McpServerTable: FC<McpServerTableProps> = ({ servers, onDelete, onToggleActive }) => {
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

export { AddMcpServerModal, McpServerTable };
