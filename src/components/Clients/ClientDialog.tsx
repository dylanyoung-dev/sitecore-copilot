import { ClientData, EnvironmentOptions } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ClientDialogProps {
  client: ClientData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: ClientData) => void;
}

const inputSchema = z
  .object({
    product: z.string().min(1, { message: 'Product is required' }),
    clientId: z.string().min(1, { message: 'Client ID is required' }),
    clientSecret: z.string().min(1, { message: 'Client Secret is required' }),
    environment: z.string().min(1, { message: 'Environment is required' }),
    region: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.product === ProductOptions.PersonalizeCDP) {
        return data.region && data.region.length > 0;
      }
      return true;
    },
    {
      message: 'Region is required when product is CDP/Personalize',
      path: ['region'],
    }
  );

export const ClientDialog: FC<ClientDialogProps> = ({ isOpen, onOpenChange, client, onSave }) => {
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
    const input = inputSchema.parse(data);
    //console.log(input as ClientData);

    onSave(input as ClientData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Make changes to the client here.' : 'Add a new client here.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)}>
          <FormProvider {...methods}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="selectedProduct">Product/Feature</Label>
                <Select onValueChange={(value) => setValue('product', value as ProductOptions)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a Product/Feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductOptions).map((product) => (
                      <SelectItem value={product.toString()}>{product}</SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {methods.watch('product') === ProductOptions.PersonalizeCDP && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Region</Label>
                  <Select onValueChange={(value) => setValue('region', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Region">{methods.watch('region') || 'Region'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">Europe</SelectItem>
                      <SelectItem value="AP">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Organization</Label>
                <Input className="col-span-3" {...methods.register('organizationId')} placeholder="Organization" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Environment</Label>
                <Select onValueChange={(value) => setValue('environment', value as EnvironmentOptions)}>
                  <SelectTrigger className="col-span-3">
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="block text-sm font-medium text-gray-700">Client ID</Label>
                <Input {...methods.register('clientId')} className="col-span-3" placeholder="Client ID" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="block text-sm font-medium text-gray-700">Client Secret</Label>
                <Input
                  className="col-span-3"
                  {...methods.register('clientSecret')}
                  placeholder="Client Secret"
                  type="password"
                />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
