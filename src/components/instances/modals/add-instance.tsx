import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getApiDefinitions } from '@/data/apiDefinitions';
import { Environments, FieldTypes, IFieldDefinition, IInstance, ProductTypes } from '@/models/IInstance';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface AddInstanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddInstanceModal: FC<AddInstanceModalProps> = ({ open, onOpenChange }) => {
  const { control, handleSubmit, watch, setValue } = useForm<IInstance>({
    defaultValues: {
      product: undefined,
      environment: undefined,
      fields: {},
    },
  });

  const product = watch('product');
  const apiType = watch('apiType');
  const environment = watch('environment');

  const selectedApiDefinition = getApiDefinitions().find((def) => def.product === product && def.apiType === apiType);

  const onSubmit = (data: IInstance) => {
    if (!product || !apiType || !environment || !selectedApiDefinition) {
      console.error('Missing required fields');
      return;
    }

    // const instance: IInstance = {
    //   id = crypto.randomUUID(),
    //   endpoint: selectedApiDefinition.endpoint,
    //   name: product,
    //   environment,
    //   fields,
    // };

    console.log('Configured Instance:', data);
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

          {/* Endpoint URL */}
          <div>
            <p className="font-medium mb-2">Endpoint URL:</p>
            <Controller
              name="endpoint"
              control={control}
              render={({ field }) => (
                <Input type="url" placeholder="Enter endpoint URL" required className="w-full" {...field} />
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

          {/* Environment Selection */}
          {product && (
            <div>
              <p className="font-medium mb-2">Select Environment:</p>
              <Controller
                name="environment"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(value as Environments)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Environments).map((env) => (
                        <SelectItem key={env} value={env}>
                          {env}
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
          <div className="mt-4">{product && apiType && environment && <Button type="submit">Submit</Button>}</div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
