import { Server, Settings } from 'lucide-react';
import { FC } from 'react';

interface SelectionModeProps {
  onSelectPreconfigured: () => void;
  onSelectCustom: () => void;
}

export const SelectionMode: FC<SelectionModeProps> = ({ onSelectPreconfigured, onSelectCustom }) => (
  <div className="grid grid-cols-2 gap-4 mt-4">
    <button
      onClick={onSelectPreconfigured}
      className="p-6 cursor-pointer border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
    >
      <Server className="h-8 w-8 mb-3 mx-auto text-gray-600 group-hover:text-blue-600" />
      <h3 className="font-semibold mb-1">Preconfigured</h3>
      <p className="text-sm text-gray-600">Choose from available MCP servers</p>
    </button>
    <button
      onClick={onSelectCustom}
      className="p-6 cursor-pointer border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
    >
      <Settings className="h-8 w-8 mb-3 mx-auto text-gray-600 group-hover:text-green-600" />
      <h3 className="font-semibold mb-1">Custom</h3>
      <p className="text-sm text-gray-600">Configure your own MCP server</p>
    </button>
  </div>
);
