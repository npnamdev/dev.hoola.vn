"use client";

import { useState, useMemo, ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

interface AppLayoutProps { children: ReactNode }

export default function AppLayout({ children }: AppLayoutProps) {
    const [selectedMenu, setSelectedMenu] = useState<string>("")

    return (
        <SidebarProvider>
            <AppSidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-5">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>
                    <div className="flex items-center">

                        <Button asChild>
                            <Link href="https://hoola.vn" className="text-13" target="_blank" rel="noopener noreferrer">Dùng thử</Link>
                        </Button>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
