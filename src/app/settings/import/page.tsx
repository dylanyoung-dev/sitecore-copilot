'use client';

import { useTokens } from '@/hooks/use-tokens';
import { useMcpServers } from '@/hooks/use-mcp-servers';
import { useInstances } from '@/hooks/use-instances';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, AlertCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { toast } from 'sonner';
import { useFeatureFlags } from '@/context/FeatureFlagContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function ImportExportPage() {
  const { tokens, setAllTokens } = useTokens();
  const { servers, setAllServers } = useMcpServers();
  const { instances, setAllInstances } = useInstances();
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Export all data to a JSON file
  const handleExport = async () => {
    const exportData = {
      tokens,
      servers,
      instances,
      exportedAt: new Date().toISOString(),
    };

    try {
      // Use File System Access API to save file
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `copilot-config.json`,
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(exportData, null, 2));
      await writable.close();

      toast.success('Configuration exported successfully');
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        toast.error('Failed to export configuration');
        console.error(err);
      }
    }
  };

  // Import data from a JSON file
  const handleImport = async () => {
    try {
      // Use File System Access API to open file
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const file = await fileHandle.getFile();
      const contents = await file.text();
      const data = JSON.parse(contents);

      // Validate data structure
      if (!data.tokens || !data.servers || !Array.isArray(data.tokens) || !Array.isArray(data.servers)) {
        setImportMessage({
          type: 'error',
          text: 'Invalid configuration file structure.',
        });
        return;
      }

      // Import data
      if (data.tokens) setAllTokens(data.tokens);
      if (data.servers) setAllServers(data.servers);
      if (data.instances) setAllInstances(data.instances);

      setImportMessage({
        type: 'success',
        text: 'Configuration imported successfully.',
      });

      toast.success('Configuration imported successfully');
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setImportMessage({
          type: 'error',
          text: 'Failed to import configuration file.',
        });
        toast.error('Failed to import configuration');
        console.error(err);
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Import/Export Configuration</h1>
              <p className="text-muted-foreground">
                Import or export your Copilot configuration for backup or transfer.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Data</CardTitle>
                <CardDescription>
                  This will export or import all your API tokens, MCP servers, instances, and feature flags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {importMessage && (
                  <Alert className={`mb-4 ${importMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center">
                      {importMessage.type === 'success' ? (
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <AlertTitle className={importMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                        {importMessage.type === 'success' ? 'Success' : 'Error'}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-1">{importMessage.text}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Current Configuration</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>API Tokens:</span> <span className="font-medium">{tokens.length}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>MCP Servers:</span> <span className="font-medium">{servers.length}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Instances:</span> <span className="font-medium">{instances.length}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Before You Import</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Importing will replace all your current configuration. Make sure to export your current config
                      first if needed.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Only import configuration files from trusted sources.
                    </p>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" className="cursor-pointer" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
                <Button onClick={handleImport} className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
