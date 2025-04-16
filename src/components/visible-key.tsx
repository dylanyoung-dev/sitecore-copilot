import { Eye, EyeOff } from 'lucide-react';
import { FC, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface VisibleKeyProps {
  keyValue: string | undefined;
}

export const VisibleKey: FC<VisibleKeyProps> = ({ keyValue }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const maskKey = (key: string) => '•'.repeat(20) + key.slice(-4);

  if (!keyValue || keyValue === '') {
    return <Badge variant="secondary">Not Set</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">{isVisible ? keyValue : maskKey(keyValue)}</span>
      <Button variant="ghost" size="sm" onClick={toggleVisibility}>
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};
