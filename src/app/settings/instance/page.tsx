'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { ListingTable } from '@/components/instances/listing-table';
import { AddInstanceModal } from '@/components/instances/modals/add-instance';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useInstances } from '@/hooks/use-instances';
import { IInstance } from '@/models/IInstance';
import { Separator } from '@radix-ui/react-separator';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstanceSetupPage() {
  const { instances, addInstance, deleteInstance } = useInstances();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteInstance = (id: string) => {
    deleteInstance(id);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Instance Configuration</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-6 px-4">
          <div className="border bg-card text-card-foreground shadow-sm ">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Instance Configuration</h1>
                <div className="flex gap-2">
                  <Button className="cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Instance
                  </Button>
                </div>
              </div>

              <AddInstanceModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

              <ListingTable instances={instances} onDelete={handleDeleteInstance} />
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
