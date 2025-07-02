"use client";
import React, { ReactNode } from 'react'
import {
   SidebarInset,
   SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/app-sidebar';
import SiteHeader from '@/components/site-header';

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
   const { user, logout } = useAuth();
   // const isLoggedIn = !!user; // Check if user is logged in
   return (
      <SidebarProvider>
         <AppSidebar user={user} />
         <SidebarInset>
            <SiteHeader logout={logout} />
            {children}
         </SidebarInset>
      </SidebarProvider>
   )
}

export default MarginWidthWrapper