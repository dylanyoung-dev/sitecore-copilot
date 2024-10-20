import { ClientData, EnvironmentOptions } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { SelectContent, SelectItem } from '@radix-ui/react-select';
import { FC, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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

  const methods = useForm<ClientData>({
    defaultValues: {
      product: (client?.product as ProductOptions) || '',
      organizationId: client?.organizationId || '',
      clientId: client?.clientId || '',
      clientSecret: client?.clientSecret || '',
      region: client?.region || '',
      environment: (client?.environment as EnvironmentOptions) || '',
    },
  });

  const { handleSubmit, setValue } = methods;

  const handleSave = (data: ClientData) => {
    onSave(data);
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
            <FormItem>
              <FormLabel>Product/Feature</FormLabel>
              <Select onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProductOptions).map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select onValueChange={(value) => setValue('region', value)} defaultValue={client?.region || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Region">{methods.watch('region') || 'Region'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="EU">Europe</SelectItem>
                  <SelectItem value="AP">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Input ref={organizationRef} defaultValue={client?.organizationId || ''} placeholder="Organization" />
            </FormItem>
            <FormItem>
              <FormLabel>Environment</FormLabel>
              <Select defaultValue={client?.environment || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EnvironmentOptions).map((env) => (
                    <SelectItem key={env} value={env}>
                      {env}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">Client ID</FormLabel>
              <Input ref={clientIdRef} defaultValue={client?.clientId || ''} placeholder="Client ID" />
            </FormItem>
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700">Client Secret</FormLabel>
              <Input
                ref={clientSecretRef}
                defaultValue={client?.clientSecret || ''}
                placeholder="Client Secret"
                type="password"
              />
            </FormItem>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
