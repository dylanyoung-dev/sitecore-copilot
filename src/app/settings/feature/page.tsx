'use client';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { useFeatureFlags } from '@/context/FeatureFlagContext';
import featureFlags from '@/data/featureFlags';
import { Separator } from '@radix-ui/react-separator';

export default function FeatureFlagPage() {
  const { flags, toggleFlag } = useFeatureFlags();

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
                  <BreadcrumbPage>Feature Flags</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="container mx-auto py-6 px-4">
          <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Feature Flags</h1>
              </div>
              <p className="text-muted-foreground mb-4">
                Use feature flags to enable or disable features in your application. This is useful for testing and
                rolling out new features gradually.
              </p>
              {featureFlags.length === 0 ? (
                <p className="text-muted-foreground">No feature flags available.</p>
              ) : (
                <div className="space-y-6">
                  {featureFlags.map((flag) => (
                    <div key={flag.key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{flags[flag.key] ? 'On' : 'Off'}</span>
                        <Switch
                          checked={flags[flag.key] ?? flag.enabled}
                          className="cursor-pointer"
                          onCheckedChange={() => toggleFlag(flag.key)}
                          aria-label={`Toggle ${flag.description}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
