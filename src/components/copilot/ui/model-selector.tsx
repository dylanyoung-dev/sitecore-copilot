import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getModelsByTokenProvider } from '@/models/enumModels';
import { enumTokenProviders, IToken } from '@/models/IToken';

interface ModelSelectorProps {
  tokens: IToken[];
  onModelChange: (value: string) => void;
  defaultModel?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  tokens,
  onModelChange,
  defaultModel = 'gpt-4o-mini',
}) => {
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string; provider: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  // Process tokens and populate models
  useEffect(() => {
    if (tokens && tokens.length > 0) {
      // Get active tokens first, or all tokens if none are active
      const activeTokens = tokens.filter((t) => t.active);
      const tokensToUse = activeTokens.length > 0 ? activeTokens : tokens;

      // Collect all models from all providers
      let allModels: { id: string; name: string; provider: string }[] = [];

      tokensToUse.forEach((token) => {
        const providerModels = getModelsByTokenProvider(token.provider as enumTokenProviders);
        if (providerModels.length > 0) {
          allModels = [
            ...allModels,
            ...providerModels.map((m) => ({
              id: m.id,
              name: m.name,
              provider: token.provider,
            })),
          ];
        }
      });

      // Remove duplicates
      const uniqueModels = allModels.filter((model, index, self) => index === self.findIndex((m) => m.id === model.id));

      // Sort models
      uniqueModels.sort((a, b) => {
        if (a.provider === b.provider) {
          return a.name.localeCompare(b.name);
        }
        if (a.provider === 'openai') return -1;
        if (b.provider === 'openai') return 1;
        return a.provider.localeCompare(b.provider);
      });

      setAvailableModels(uniqueModels);

      // Set default model
      const defaultModelObj = uniqueModels.find((m) => m.id === defaultModel) || uniqueModels[0];
      if (defaultModelObj) {
        setSelectedModel(defaultModelObj.id);
        onModelChange(defaultModelObj.id);
      }
    }
  }, [tokens, defaultModel, onModelChange]);

  const handleValueChange = (value: string) => {
    setSelectedModel(value);
    onModelChange(value);
  };

  return (
    <Select value={selectedModel} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[220px] h-8 text-xs">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(
          availableModels.reduce((acc, model) => {
            if (!acc[model.provider]) {
              acc[model.provider] = [];
            }
            acc[model.provider].push(model);
            return acc;
          }, {} as Record<string, typeof availableModels>)
        ).map(([provider, models]) => (
          <div key={provider}>
            <div className="px-2 py-1.5 text-xs font-semibold bg-muted/50">{provider.toUpperCase()}</div>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};
