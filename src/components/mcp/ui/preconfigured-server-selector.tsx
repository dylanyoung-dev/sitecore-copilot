import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IYamlServerConfig } from '@/models/IYamlConfig';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { FC, useMemo } from 'react';

interface Props {
  preconfiguredServers: IYamlServerConfig[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onSelect: (server: IYamlServerConfig) => void;
}

export const PreconfiguredServerSelector: FC<Props> = ({
  preconfiguredServers,
  selectedCategory,
  setSelectedCategory,
  isLoading,
  onBack,
  onSelect,
}) => {
  const categories = useMemo(() => {
    return Array.from(new Set(preconfiguredServers.map((s) => s.category || 'Other'))).sort((a, b) => {
      // Keep "Other" category at the end if it exists
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      // Otherwise sort alphabetically
      return a.localeCompare(b);
    });
  }, [preconfiguredServers]);

  const filteredServers = useMemo(() => {
    return preconfiguredServers.filter((s) => (s.category || 'Other') === selectedCategory);
  }, [preconfiguredServers, selectedCategory]);

  return (
    <div className="flex gap-6 h-[calc(100vh-24rem)]">
      {/* Category Selector */}
      <div className="w-40 overflow-y-auto">
        <div className="font-semibold mb-2 sticky top-0 bg-background py-1">Categories</div>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <Button
                className={`w-full justify-start text-sm py-1.5 h-auto cursor-pointer`}
                variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* Server List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 sticky top-0 z-10 bg-background">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading server configurations...</span>
          </div>
        ) : filteredServers.length === 0 ? (
          <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
            <p className="text-sm text-yellow-800">No servers in this category.</p>
          </div>
        ) : (
          filteredServers.map((server) => (
            <div
              key={server.label}
              onClick={() => !server.disabled && onSelect(server)}
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
    </div>
  );
};
