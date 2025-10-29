
"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


import { useState, useMemo } from "react"
import ProfileHeader from "@/components/profile-header"


export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  // Menu data giống trong AppSidebar
  const menuData = [
    {
      title: "Kết nối API",
      items: [
        "Tài khoản",
        "Chi tiết tài khoản",
        "Danh sách tài khoản",
        "Tìm kiếm tài khoản",
        "Đếm tài khoản",
        "Tạo tài khoản",
        "Tạo nhiều tài khoản",
        "Tạo token",
        "Đăng nhập",
        "Xoá tài khoản",
        "Đặt lại mật khẩu",
        "Chi tiết khoá học",
        "Danh sách khoá học",
        "Tìm kiếm khoá học",
        "Đếm khoá học",
        "Gán khoá học vào tài khoản",
        "Gán nhiều khoá học",
        "Gỡ khoá học khỏi tài khoản"
      ]
    },
    {
      title: "Architecture",
      items: [
        "Accessibility",
        "Fast Refresh",
        "Next.js Compiler",
        "Supported Browsers",
        "Turbopack"
      ]
    },
    {
      title: "Community",
      items: ["Contribution Guide"]
    }
  ];

  // Xác định breadcrumb động
  const breadcrumb = useMemo(() => {
    if (!selectedMenu) return null;
    // Tìm parent nếu là submenu
    const parent = menuData.find((m) => m.title === selectedMenu || m.items.includes(selectedMenu));
    if (!parent) return null;
    if (parent.title === selectedMenu) {
      // Chọn menu cha
      return [parent.title];
    } else {
      // Chọn submenu
      return [parent.title, selectedMenu];
    }
  }, [selectedMenu]);

  return (
    <SidebarProvider>
      <AppSidebar
        selectedMenu={selectedMenu}
        onSelectMenu={setSelectedMenu}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumb && breadcrumb.length > 0 && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{breadcrumb[0]}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {breadcrumb[1] && (
                      <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{breadcrumb[1]}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center">
            <ProfileHeader />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center text-2xl font-bold">
            {selectedMenu ? selectedMenu : "Chọn menu để hiển thị tên"}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
