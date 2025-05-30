'use client';

import { BrainCircuit, HousePlug, Server, Settings, SquareUserRound } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'My Copilot',
      logo: BrainCircuit,
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: HousePlug,
    },
    {
      title: 'Copilot',
      url: '/copilot',
      icon: SquareUserRound,
    },
    {
      title: 'Configuration',
      url: '#',
      icon: Settings,
      isActive: true,
      items: [
        {
          title: 'Sitecore Instances',
          url: '/settings/instance',
        },
        {
          title: 'Feature Flags',
          url: '/settings/feature',
        },
        {
          title: 'Configure MCP',
          url: '/settings/mcp',
          icon: Server,
        },
        {
          title: 'API Tokens',
          url: '/settings/config',
        },
        {
          title: 'Import/Export',
          url: '/settings/import',
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
