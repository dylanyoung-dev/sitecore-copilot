import { ClientData, EnvironmentOptions } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { SelectItem } from '@radix-ui/react-select';
import { FC, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface ClientDialogProps {
  client: ClientData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: ClientData) => void;
}

export const ClientDialog: FC<ClientDialogProps> = ({ isOpen, onOpenChange, client, onSave }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const organizationRef = useRef<HTMLInputElement>(null);
  const clientIdRef = useRef<HTMLInputElement>(null);
  const clientSecretRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLSelectElement>(null);
  const environmentRef = useRef<HTMLSelectElement>(null);

  const handleSave = () => {
    if (
      organizationRef.current &&
      clientIdRef.current &&
      clientSecretRef.current &&
      regionRef.current &&
      environmentRef.current
    ) {
      const updatedClient: ClientData = {
        //product: selectedProduct,
        product: ProductOptions.XMCloud,
        organizationId: organizationRef.current.value,
        clientId: clientIdRef.current.value,
        clientSecret: clientSecretRef.current.value,
        region: regionRef.current.value,
        environment: EnvironmentOptions.Dev,
        //environment: environmentRef.current.value,
      };
      onSave(updatedClient);
    }
  };

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(event.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Make changes to the client here.' : 'Add a new client here.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <Select>
              <SelectItem value="XMCloud">XM Cloud</SelectItem>
              <SelectItem value="XMPlatform">XM Platform</SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <Select defaultValue={client?.region || ''}>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="EU">Europe</SelectItem>
              <SelectItem value="AP">Asia Pacific</SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <Input ref={organizationRef} defaultValue={client?.organizationId || ''} placeholder="Organization" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Environment</label>
            <Select defaultValue={client?.environment || ''}>
              <SelectItem value="dev">Development</SelectItem>
              <SelectItem value="prod">Production</SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <Input ref={clientIdRef} defaultValue={client?.clientId || ''} placeholder="Client ID" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Secret</label>
            <Input
              ref={clientSecretRef}
              defaultValue={client?.clientSecret || ''}
              placeholder="Client Secret"
              type="password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
