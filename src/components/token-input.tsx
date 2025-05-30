import React, { FC } from 'react';
import { Input } from '@/components/ui/input';
import { KeyRound, X } from 'lucide-react';

export const TokenInput: FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  // Check if value exists and matches our {key} pattern
  const isToken = value && value.match(/^\{(.+)\}$/);

  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    onChange(''); // This should reset the value
  };

  if (isToken) {
    return (
      <div
        className={`flex items-center h-10 px-3 py-2 text-sm rounded-md border border-input bg-background w-full ${className}`}
      >
        <div className="flex-1">
          <button
            type="button"
            onClick={handleResetClick}
            className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-xs transition-colors cursor-pointer"
          >
            <KeyRound className="h-3 w-3 mr-1" />
            {isToken[1]}
            <X className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return <Input value={value || ''} onChange={(e) => onChange(e.target.value)} className={`w-full ${className}`} />;
};
