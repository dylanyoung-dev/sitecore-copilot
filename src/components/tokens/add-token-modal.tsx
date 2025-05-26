'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { enumTokenCategories, enumTokenProviders, IToken, providerCategoryMap } from '@/models/IToken';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  category: z.nativeEnum(enumTokenCategories, { message: 'Please select a token category' }),
  provider: z.nativeEnum(enumTokenProviders, { message: 'Please select a provider' }),
  token: z.string().min(1, { message: 'API token is required' }),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<IToken, 'id'>) => void;
}

export const AddTokenModal = ({ open, onOpenChange, onSubmit }: AddTokenModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: enumTokenCategories.AI,
      provider: enumTokenProviders.OpenAI,
      token: '',
      active: true, // New tokens are active by default
    },
  });

  // When category changes, update provider to first one in that category
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'category') {
        const category = value.category as enumTokenCategories;
        // Find first provider that matches this category
        const availableProviders = Object.entries(providerCategoryMap)
          .filter(([_, providerCategory]) => providerCategory === category)
          .map(([provider]) => provider as enumTokenProviders);

        if (availableProviders.length > 0) {
          form.setValue('provider', availableProviders[0]);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New API Token</DialogTitle>
          <DialogDescription>Add your API tokens to use with the application.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={enumTokenCategories.AI}>AI Services</SelectItem>
                      <SelectItem value={enumTokenCategories.BusinessTools}>Business Tools</SelectItem>
                      <SelectItem value={enumTokenCategories.DevOps}>DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Token Provider Selection - dynamically filtered by category */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(providerCategoryMap)
                        .filter(([_, category]) => category === form.watch('category'))
                        .map(([provider]) => (
                          <SelectItem key={provider} value={provider as enumTokenProviders}>
                            {provider}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My OpenAI Token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>{' '}
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        form.watch('provider') === enumTokenProviders.OpenAI
                          ? 'sk-...'
                          : form.watch('provider') === enumTokenProviders.Anthropic
                          ? 'sk-ant-...'
                          : form.watch('provider') === enumTokenProviders.GitHub
                          ? 'ghp_...'
                          : form.watch('provider') === enumTokenProviders.Atlassian
                          ? 'atlassian-token'
                          : 'API Token'
                      }
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground mt-1">
                    {form.watch('provider') === enumTokenProviders.OpenAI
                      ? "Enter your OpenAI API key starting with 'sk-'"
                      : form.watch('provider') === enumTokenProviders.Anthropic
                      ? "Enter your Anthropic API key starting with 'sk-ant-'"
                      : form.watch('provider') === enumTokenProviders.GitHub
                      ? 'Enter your GitHub Personal Access Token'
                      : form.watch('provider') === enumTokenProviders.Azure
                      ? 'Enter your Azure API key'
                      : 'Enter your API token'}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 mt-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as active token for this provider</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Only one token per category/provider combination can be active at a time
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                Add Token
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
