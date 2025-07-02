import React from 'react'
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from './ui/mood-toggle'
import { ThemeSelector } from './theme-selector'
import { Power } from 'lucide-react'
import { DynamicBreadcrumb } from './ui/dynamic-breadcrumb'

interface SiteHeaderProps {
    logout?: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ logout }) => {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb
                // homeLabel="Home"
                // capitalizeLabels={true}
                // maxItems={4}
                // dropdownMappings={dropdownMappings}
                />
            </div>
            <div className="flex items-center gap-4 px-4">
                <ThemeSelector />
                <ModeToggle />
                {logout && <Power className="cursor-pointer" color='red' onClick={logout} />}
            </div>
        </header>
    )
}

export default SiteHeader
