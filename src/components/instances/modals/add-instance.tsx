'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getApiDefinitions } from '@/data/apiDefinitions';
import { FieldTypes, IFieldDefinition, IInstance, ProductTypes } from '@/models/IInstance';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface AddInstanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getExistingInstances = (): IInstance[] => {
  if (typeof window === 'undefined') return []; // Ensure this runs only on the client side
  const storedInstances = sessionStorage.getItem('instances');
  return storedInstances ? JSON.parse(storedInstances) : [];
};

export const AddInstanceModal: FC<AddInstanceModalProps> = ({ open, onOpenChange }) => {
  const [existingInstances, setExistingInstances] = useState<IInstance[]>();
  const { control, handleSubmit, watch, setValue } = useForm<IInstance>({
    defaultValues: {
      product: undefined,
      fields: {},
    },
  });

  useEffect(() => {
    setExistingInstances(getExistingInstances());
  }, []);

  const product = watch('product');
  const apiType = watch('apiType');

  const selectedApiDefinition = getApiDefinitions().find((def) => def.product === product && def.apiType === apiType);

  const onSubmit = (data: IInstance) => {
    if (!product || !apiType || !selectedApiDefinition) {
      console.error('Missing required fields');
      return;
    }

    const hasDuplicate = existingInstances?.some((instance) => {
      if (instance.apiType !== apiType || instance.product !== product) return false;

      // Check distinct fields
      return selectedApiDefinition.fields
        .filter((field) => field.distinct)
        .every((field) => instance.fields[field.name] === data.fields[field.name]);
    });

    const instance: IInstance = {
      id: crypto.randomUUID(),
      name: data.name,
      apiType,
      fields: data.fields,
      isActive: !hasDuplicate,
      product,
    };

    console.log('Configured Instance:', instance);

    // Save the instance to sessionStorage
    const updatedInstances = [...(existingInstances || []), instance];
    sessionStorage.setItem('instances', JSON.stringify(updatedInstances));
    setExistingInstances(updatedInstances);

    // Close the modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Register New Instance</DialogTitle>
          <DialogDescription>Fill in the details to register a new instance to your configuration.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <p className="font-medium mb-2">Endpoint Name:</p>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input type="text" placeholder="Enter endpoint name" required className="w-full" {...field} />
              )}
            />
          </div>

          {/* Product Selection */}
          <div>
            <p className="font-medium mb-2">Select Product:</p>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(value as ProductTypes)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProductTypes).map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* API Type Selection */}
          {product && (
            <div>
              <p className="font-medium mb-2">Select API Definition:</p>
              <Controller
                name="apiType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an API type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getApiDefinitions()
                        .filter((def) => def.product === product)
                        .map((def) => (
                          <SelectItem key={def.name} value={def.apiType}>
                            {def.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {/* Dynamic Fields */}
          {selectedApiDefinition &&
            selectedApiDefinition.fields.map((field: IFieldDefinition) => (
              <div key={field.name}>
                <p className="font-medium mb-2">{field.label}:</p>
                {field.type === FieldTypes.Text && (
                  <Controller
                    name={`fields.${field.name}`}
                    control={control}
                    render={({ field: textField }) => (
                      <Input
                        type="text"
                        placeholder={field.label}
                        required={field.required}
                        onChange={(e) => textField.onChange(e.target.value)}
                      />
                    )}
                  />
                )}
                {field.type === FieldTypes.Select && field.options && field.options.length > 0 && (
                  <Controller
                    name={`fields.${field.name}`}
                    control={control}
                    render={({ field: selectField }) => (
                      <Select onValueChange={(value) => selectField.onChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            ))}

          {/* Submit Button */}
          <div className="mt-4">{product && apiType && <Button type="submit">Submit</Button>}</div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
