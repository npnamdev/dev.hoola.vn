'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { Home, LogOut } from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Bell, Search, Plus, HelpCircle } from 'lucide-react';
import { Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CreateAutomationDialog from './automations/CreateAutomationDialog';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isCreateAutomationOpen, setIsCreateAutomationOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsCreateAutomationOpen(true);
    window.addEventListener('open-create-automation-modal', handler);
    return () => window.removeEventListener('open-create-automation-modal', handler);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-muted/30 flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-white">
          <div className="flex items-center gap-3 px-5 w-full">
            {/* Left Section */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm workflows, automations... (Cmd+K)"
                className="w-full pl-8 pr-4 h-9 text-13 bg-muted/50 border-0 focus-visible:ring-1"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <CommandIcon className="h-3 w-3" />K
              </kbd>
            </div>

            <div className="flex-1" />

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Create Automation Button */}
              <Button size="sm" onClick={() => setIsCreateAutomationOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="text-13">Tạo automation</span>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute top-[2px] right-[2px] h-3.5 w-3.5 flex items-center justify-center p-0 text-[9px]">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="text-xs">Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start py-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-13 font-medium">Workflow hoàn thành</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">2 phút trước</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Workflow "Send Welcome Email" đã chạy thành công
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start py-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-13 font-medium">Lỗi automation</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">15 phút trước</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automation "Data Sync" gặp lỗi kết nối
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex-col items-start py-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-13 font-medium">Nâng cấp thành công</span>
                      <span className="ml-auto text-[10px] text-muted-foreground">1 giờ trước</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tài khoản của bạn đã được nâng cấp lên Pro
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-13 text-blue-600">
                    Xem tất cả thông báo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar với Command để giữ hover đẹp */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 p-0 overflow-hidden rounded-lg border shadow-md">
                  <Command>
                    <CommandList>
                      <CommandEmpty className="text-xs text-muted-foreground">Không có kết quả</CommandEmpty>

                      <CommandGroup>
                        <CommandItem
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-13"
                          onSelect={() => router.push('/')}
                        >
                          <Home className="h-4 w-4 text-blue-600" />
                          Trang chủ
                        </CommandItem>

                        <CommandItem
                          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 cursor-pointer text-red-600 text-13"
                          onSelect={async () => { await logout(); router.push('/'); }}
                        >
                          <LogOut className="h-4 w-4 text-red-600" />
                          Đăng xuất
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </SidebarInset>

      {/* Create Automation Modal dùng component chuẩn */}
      <CreateAutomationDialog
        open={isCreateAutomationOpen}
        onOpenChange={setIsCreateAutomationOpen}
        mutate={undefined}
        onCreated={(automationId) => {
          setIsCreateAutomationOpen(false);
          if (automationId) {
            router.push(`/dashboard/automations?automationId=${automationId}`);
          } else {
            router.push('/dashboard/automations');
          }
        }}
      />
    </SidebarProvider>
  );
}
