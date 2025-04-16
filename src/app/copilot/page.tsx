'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { CopilotChat } from '@/components/copilot/copilot-chat';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useInstances } from '@/hooks/use-instances';
import { useTokens } from '@/hooks/use-tokens';
import { IInstance } from '@/models/IInstance';
import { enumTokenTypes, IToken } from '@/models/IToken';
import { Separator } from '@radix-ui/react-separator';
import { useEffect, useState } from 'react';

export default function CopilotPage() {
  const [instances, setInstances] = useState<IInstance[]>([]);
  const [openAiToken, setOpenAIToken] = useState<IToken | undefined>();
  const instanceStorage = useInstances();
  const tokenStorage = useTokens();

  useEffect(() => {
    const openAIConfig = tokenStorage.getTokenByType(enumTokenTypes.OpenAI);

    if (openAIConfig) {
      setOpenAIToken(openAIConfig);
    }
  }, []);

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
                  <BreadcrumbPage>Copilot</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="container mx-auto py-6 px-4">
          <div className="">
            <div className="p-6">
              {openAiToken ? (
                <CopilotChat token={openAiToken} instances={instances} />
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    Please configure an OpenAI API token in settings to use the Copilot.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
