import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HeaderConfig } from '@/models/IMcpServer';
import { AlertCircle, ChevronLeft, Info, Plus, X } from 'lucide-react';
import { FC, useState } from 'react';

interface HeadersConfigProps {
  headers: HeaderConfig[];
  onHeadersChange: (headers: HeaderConfig[]) => void;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const HeadersConfig: FC<HeadersConfigProps> = ({ headers, onHeadersChange, onBack, onSave, onCancel }) => {
  const [newHeader, setNewHeader] = useState<HeaderConfig>({
    key: '',
    value: '',
    required: false,
  });

  const handleHeaderChange = (index: number, field: keyof HeaderConfig, value: string | boolean) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onHeadersChange(updatedHeaders);
  };

  const handleAddHeader = () => {
    if (newHeader.key && newHeader.value) {
      onHeadersChange([...headers, newHeader]);
      setNewHeader({ key: '', value: '', required: false });
    }
  };

  const handleRemoveHeader = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    onHeadersChange(updatedHeaders);
  };

  return (
    <div className="space-y-4">
      <Button type="button" variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3 mb-4">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800">Required Headers</p>
          <p className="text-blue-700">
            This server requires additional headers. Some values may be auto-filled from your existing configurations.
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save and Add Server</Button>
      </div>
    </div>
  );
};
