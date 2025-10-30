
import Link from "next/link"
import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    navMain: [
        // {
        //     title: "Bắt đầu",
        //     url: "#",
        //     items: [
        //         {
        //             title: "Cài đặt",
        //             url: "#",
        //         },
        //         {
        //             title: "Cấu trúc dự án",
        //             url: "#",
        //         },
        //     ],
        // },
        {
            title: "Kết nối API",
            url: "#",
            items: [
                // Nhóm: Tài khoản
                { title: "Tài khoản", url: "/api-connection/account" },
                { title: "Chi tiết tài khoản", url: "/api-connection/get-account" },
                { title: "Danh sách tài khoản", url: "/api-connection/get-accounts" },
                { title: "Tìm kiếm tài khoản", url: "/api-connection/search-account" },
                { title: "Đếm tài khoản", url: "/api-connection/count-accounts" },
                { title: "Tạo tài khoản", url: "/api-connection/create-account" },
                { title: "Tạo nhiều tài khoản", url: "/api-connection/create-many-accounts" },
                { title: "Tạo token", url: "/api-connection/create-token" },
                { title: "Đăng nhập", url: "/api-connection/login" },
                { title: "Xoá tài khoản", url: "/api-connection/delete-account", isActive: true },
                { title: "Đặt lại mật khẩu", url: "/api-connection/reset-password" },
                { title: "Chi tiết khoá học", url: "/api-connection/get-course" },
                { title: "Danh sách khoá học", url: "/api-connection/get-courses" },
                { title: "Tìm kiếm khoá học", url: "/api-connection/search-course" },
                { title: "Đếm khoá học", url: "/api-connection/count-courses" },
                { title: "Gán khoá học vào tài khoản", url: "/api-connection/assign-course" },
                { title: "Gán nhiều khoá học", url: "/api-connection/assign-many-courses" },
                { title: "Gỡ khoá học khỏi tài khoản", url: "/api-connection/remove-course" },
            ],
        },
    ],
}

export function AppSidebar({ onSelectMenu, selectedMenu, ...props }: React.ComponentProps<typeof Sidebar> & {
    onSelectMenu?: (menuName: string) => void;
    selectedMenu?: string;
}) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Documentation</span>
                                    <span className="text-xs">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={selectedMenu === item.title}
                                    onClick={() => onSelectMenu?.(item.title)}
                                >
                                    <Link href={item.url} className="font-medium">
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={selectedMenu === subItem.title}
                                                    onClick={() => onSelectMenu?.(subItem.title)}
                                                >
                                                    <Link href={subItem.url}>{subItem.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
