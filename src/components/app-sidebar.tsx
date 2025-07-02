"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AdminNavMain, Roles, SITE_NAME, StudentNavMain } from "@/config"
import { AuthUser } from "@/types/user"

// This is sample data.
const data = {
  teams: [
    {
      name: `${SITE_NAME}`,
      logo: GalleryVerticalEnd,
      plan: "Online Learning",
    },
    {
      name: `${SITE_NAME}`,
      logo: AudioWaveform,
      plan: "Open Distant Learning",
    },
    {
      name: `${SITE_NAME}`,
      logo: Command,
      plan: "Distant Learning",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthUser | null;
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userData = {
    name: user?.first_name + " " + user?.last_name,
    email: user?.email ?? "",
    avatar: user?.passport ?? "/avatars/avatar-man.jpg",
    role: user?.role ?? Roles.STUDENT,
  }

  const navMain = user?.role === Roles.STUDENT ? StudentNavMain : AdminNavMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
