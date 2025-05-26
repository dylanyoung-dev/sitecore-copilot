import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useInstances } from '@/hooks/use-instances';
import { useMcpServers } from '@/hooks/use-mcp-servers';
import { useTokens } from '@/hooks/use-tokens';
import { IHeaderConfig } from '@/models/IHeaderConfig';
import { IMcpServer } from '@/models/IMcpServer';
import { IYamlServerConfig } from '@/models/IYamlConfig';
import { populateHeaderValues } from '@/utils/headerUtils';
import { ChevronLeft, Server, Settings } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { HeadersConfig } from './header-config-selector';
import { PreconfiguredServerSelector } from './preconfigured-server-selector';
import { McpServerTable } from './mcp-server-table';

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
  const [headers, setHeaders] = useState<IHeaderConfig[]>([]);
  const [newHeader, setNewHeader] = useState<IHeaderConfig>({ key: '', value: '', required: false });
  const { tokens } = useTokens();
  const { instances } = useInstances();
  const { preconfiguredServers, isLoading } = useMcpServers();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (preconfiguredServers.length > 0) {
      // Extract and log all unique categories from the server configurations
      const availableCategories = Array.from(
        new Set(preconfiguredServers.map((s: IYamlServerConfig) => s.category || 'Other'))
      );

      console.log('Available categories:', availableCategories);
      console.log('Preconfigured servers:', preconfiguredServers);

      // Set the first category as selected if none is selected
      if (!selectedCategory) {
        setSelectedCategory(availableCategories[0]);
      }
    }
  }, [preconfiguredServers, selectedCategory]);

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

  const handlePreconfiguredSelect = (server: IYamlServerConfig) => {
    // Get any predefined headers for this server directly from the server config
    let serverHeaders: IHeaderConfig[] = [];

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

  const handleHeaderChange = (index: number, field: keyof IHeaderConfig, value: string | boolean) => {
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
          <PreconfiguredServerSelector
            preconfiguredServers={preconfiguredServers}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isLoading={isLoading}
            onBack={() => setMode('selection')}
            onSelect={handlePreconfiguredSelect}
          />
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
          <HeadersConfig
            headers={headers}
            onHeadersChange={setHeaders}
            onBack={() => setMode('preconfigured')}
            onCancel={() => setMode('preconfigured')}
            onSave={() => {
              const finalForm = {
                ...form,
                headers: headers,
              };
              onSubmit(finalForm);
              handleOpenChange(false);
            }}
          />
        );
    }
  };

  const getDialogSize = () => {
    switch (mode) {
      case 'selection':
        return 'sm:max-w-md';
      case 'preconfigured':
        return 'sm:max-w-4xl';
      case 'custom':
        return 'sm:max-w-lg';
      case 'headers':
        return 'sm:max-w-2xl';
      default:
        return 'sm:max-w-md';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${getDialogSize()} mx-auto w-full`}>
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

export { AddMcpServerModal };
