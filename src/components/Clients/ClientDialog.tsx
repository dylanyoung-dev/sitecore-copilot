import { ClientData, EnvironmentOptions } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { SelectContent, SelectItem } from '@radix-ui/react-select';
import { FC, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue } from '../ui/select';

interface ClientDialogProps {
  client: ClientData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: ClientData) => void;
}

export const ClientDialog: FC<ClientDialogProps> = ({ isOpen, onOpenChange, client, onSave }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>();
  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>();
  const organizationRef = useRef<HTMLInputElement>(null);
  const clientIdRef = useRef<HTMLInputElement>(null);
  const clientSecretRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (
      organizationRef.current &&
      clientIdRef.current &&
      clientSecretRef.current &&
      selectedRegion &&
      selectedEnvironment
    ) {
      const updatedClient: ClientData = {
        //product: selectedProduct,
        product: ProductOptions.XMCloud,
        organizationId: organizationRef.current.value,
        clientId: clientIdRef.current.value,
        clientSecret: clientSecretRef.current.value,
        region: selectedRegion,
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
            <Select onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XMCloud">XM Cloud</SelectItem>
                <SelectItem value="XMPlatform">XM Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormItem>
            <FormLabel>Region</FormLabel>
            <Select onValueChange={setSelectedRegion} defaultValue={client?.region || ''}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="EU">Europe</SelectItem>
                <SelectItem value="AP">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <Input ref={organizationRef} defaultValue={client?.organizationId || ''} placeholder="Organization" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Environment</label>
            <Select defaultValue={client?.environment || ''}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Development</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
              </SelectContent>
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
