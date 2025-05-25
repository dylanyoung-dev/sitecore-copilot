import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInstances } from '@/hooks/use-instances';
import { useMcpServers } from '@/hooks/use-mcp-servers';
import { useTokens } from '@/hooks/use-tokens';
import { HeaderConfig, IMcpServer } from '@/models/IMcpServer';
import { populateHeaderValues } from '@/utils/headerUtils';
import { YamlServerConfig } from '@/utils/yamlUtils';
import { AlertCircle, ChevronLeft, Info, Loader2, Plus, Power, Server, Settings, Trash2, X } from 'lucide-react';
import { FC, useState } from 'react';

interface AddMcpServerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (server: Omit<IMcpServer, 'id'>) => void;
}

type ModalMode = 'selection' | 'preconfigured' | 'custom' | 'headers';

const AddMcpServerModal: FC<AddMcpServerModalProps> = ({ open, onOpenChange, onSubmit }) => {
  const [mode, setMode] = useState<ModalMode>('selection');
  const [form, setForm] = useState<Omit<IMcpServer, 'id'>>({
    name: '',
    url: '',
    security: 'open',
    type: 'http',
    isActive: true,
    headers: [],
  });
  const [headers, setHeaders] = useState<HeaderConfig[]>([]);
  const [newHeader, setNewHeader] = useState<HeaderConfig>({ key: '', value: '', required: false });
  const { tokens } = useTokens();
  const { instances } = useInstances();
  const { preconfiguredServers, isLoading } = useMcpServers();
  // Reset when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMode('selection');
      setForm({ name: '', url: '', security: 'open', type: 'http', isActive: true, headers: [] });
      setHeaders([]);
      setNewHeader({ key: '', value: '', required: false });
    }
    onOpenChange(newOpen);
  }; // Handle preconfigured server selection

  const handlePreconfiguredSelect = (server: YamlServerConfig) => {
    // Get any predefined headers for this server directly from the server config
    let serverHeaders: HeaderConfig[] = [];

    if (server.headers && server.headers.length > 0) {
      // Use the headers defined in YAML
      serverHeaders = [...server.headers];

      // Populate values from existing tokens and instances
      serverHeaders = populateHeaderValues(serverHeaders, tokens, instances);

      // If headers require values, show the header config screen
      const missingRequiredHeaders = serverHeaders.some((h) => h.required && !h.value);

      if (missingRequiredHeaders) {
        setForm({
          name: server.name,
          url: server.url,
          type: server.type,
          security: server.security,
          isActive: true,
          headers: serverHeaders,
        });
        setHeaders(serverHeaders);
        setMode('headers');
        return;
      }
    }

    onSubmit({
      name: server.name,
      url: server.url,
      type: server.type as 'http' | 'sse',
      security: server.security as 'open' | 'oauth',
      isActive: true,
      headers: serverHeaders,
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

    // Include the current headers
    const finalForm = {
      ...form,
      headers: headers.length > 0 ? headers : form.headers,
    };

    onSubmit(finalForm);
    handleOpenChange(false);
  };

  // Header management
  const handleAddHeader = () => {
    if (newHeader.key && newHeader.value) {
      setHeaders([...headers, newHeader]);
      setNewHeader({ key: '', value: '', required: false });
    }
  };

  const handleRemoveHeader = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
  };

  const handleHeaderChange = (index: number, field: keyof HeaderConfig, value: string | boolean) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    setHeaders(updatedHeaders);
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
            {' '}
            <Button variant="ghost" size="sm" onClick={() => setMode('selection')} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>{' '}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading server configurations...</span>
              </div>
            ) : preconfiguredServers.length === 0 ? (
              <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  No preconfigured servers available. Failed to load configurations.
                </p>
              </div>
            ) : (
              preconfiguredServers.map((server) => (
                <div
                  key={server.label}
                  onClick={() => !server.disabled && handlePreconfiguredSelect(server)}
                  className={`p-4 border rounded-lg transition-all ${
                    server.disabled
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                      : 'hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{server.label}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {server.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {server.security.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{server.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{server.url || 'URL not available'}</p>
                  {server.docUrl && (
                    <p className="text-xs text-gray-500 font-mono">
                      <a
                        href={server.docUrl}
                        className={server.disabled ? 'pointer-events-none' : ''}
                        onClick={(e) => server.disabled && e.preventDefault()}
                      >
                        Documentation
                      </a>
                    </p>
                  )}
                  {server.disabled && <p className="text-xs text-red-500 mt-2">This server is currently unavailable</p>}
                </div>
              ))
            )}
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
            </div>{' '}
            <Button type="submit" className="w-full">
              Add Server
            </Button>
          </form>
        );

      case 'headers':
        return (
          <div className="space-y-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode('preconfigured')} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3 mb-4">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Required Headers</p>
                <p className="text-blue-700">
                  This server requires additional headers. Some values may be auto-filled from your existing
                  configurations.
                </p>
              </div>
            </div>

            {/* Headers list */}
            <div className="space-y-4">
              <h3 className="font-medium">Current Headers</h3>
              {headers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No headers configured yet</p>
              ) : (
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded-md group">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block">Key</label>
                          <Input
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                            disabled={header.source?.type !== 'manual'}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <label className="text-xs text-gray-500">Value</label>
                            {header.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Required</span>
                            )}
                          </div>
                          <Input
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                            className={`text-sm ${header.required && !header.value ? 'border-red-300 bg-red-50' : ''}`}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveHeader(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new header */}
              <div className="pt-2">
                <h3 className="font-medium mb-2">Add Header</h3>
                <div className="flex items-end space-x-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block">Key</label>
                      <Input
                        value={newHeader.key}
                        onChange={(e) => setNewHeader({ ...newHeader, key: e.target.value })}
                        placeholder="x-header-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Value</label>
                      <Input
                        value={newHeader.value}
                        onChange={(e) => setNewHeader({ ...newHeader, value: e.target.value })}
                        placeholder="header-value"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddHeader} disabled={!newHeader.key || !newHeader.value} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="flex mt-2">
                  <label className="flex items-center text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={newHeader.required}
                      onChange={(e) => setNewHeader({ ...newHeader, required: e.target.checked })}
                      className="mr-1"
                    />
                    Required header
                  </label>
                </div>
              </div>
            </div>

            {/* Warning for missing required headers */}
            {headers.some((h) => h.required && !h.value) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">
                  Some required headers are missing values. The server may not work correctly.
                </p>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setMode('preconfigured')}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const finalForm = {
                    ...form,
                    headers: headers,
                  };
                  onSubmit(finalForm);
                  handleOpenChange(false);
                }}
              >
                Save and Add Server
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
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
  onEditHeaders?: (server: IMcpServer) => void;
}

const McpServerTable: FC<McpServerTableProps> = ({ servers, onDelete, onToggleActive, onEditHeaders }) => {
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
          {' '}
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Security</TableHead>
          <TableHead>Headers</TableHead>
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
              <TableCell className="uppercase">{server.type}</TableCell>{' '}
              <TableCell>
                <Badge variant={server.security === 'open' ? 'default' : 'secondary'}>{server.security}</Badge>
              </TableCell>
              <TableCell>
                {server.headers && server.headers.length > 0 ? (
                  <Tooltip>
                    <TooltipTrigger className="cursor-default">
                      <Badge variant="outline" className="hover:bg-gray-50">
                        {server.headers.length} {server.headers.length === 1 ? 'header' : 'headers'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <div className="text-xs p-1">
                        {server.headers.map((header, idx) => (
                          <div key={idx} className="flex">
                            <span className="font-mono">{header.key}:</span>
                            <span className="font-mono ml-1 truncate max-w-[150px]">{header.value}</span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-gray-400 text-xs">None</span>
                )}
              </TableCell>
              <TableCell>
                {server.isActive ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </TableCell>{' '}
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

export { AddMcpServerModal, McpServerTable };
