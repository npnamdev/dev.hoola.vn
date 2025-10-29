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
                { title: "Tài khoản", url: "#" },
                { title: "Chi tiết tài khoản", url: "#" },
                { title: "Danh sách tài khoản", url: "#" },
                { title: "Tìm kiếm tài khoản", url: "#" },
                { title: "Đếm tài khoản", url: "#" },
                { title: "Tạo tài khoản", url: "#" },
                { title: "Tạo nhiều tài khoản", url: "#" },
                { title: "Tạo token", url: "#" },
                { title: "Đăng nhập", url: "#" },
                { title: "Xoá tài khoản", url: "#", isActive: true },
                { title: "Đặt lại mật khẩu", url: "#" },

                // Nhóm: Khoá học
                { title: "Chi tiết khoá học", url: "#" },
                { title: "Danh sách khoá học", url: "#" },
                { title: "Tìm kiếm khoá học", url: "#" },
                { title: "Đếm khoá học", url: "#" },
                { title: "Gán khoá học vào tài khoản", url: "#" },
                { title: "Gán nhiều khoá học", url: "#" },
                { title: "Gỡ khoá học khỏi tài khoản", url: "#" }
            ],
        },
        // {
        //     title: "Architecture",
        //     url: "#",
        //     items: [
        //         {
        //             title: "Accessibility",
        //             url: "#",
        //         },
        //         {
        //             title: "Fast Refresh",
        //             url: "#",
        //         },
        //         {
        //             title: "Next.js Compiler",
        //             url: "#",
        //         },
        //         {
        //             title: "Supported Browsers",
        //             url: "#",
        //         },
        //         {
        //             title: "Turbopack",
        //             url: "#",
        //         },
        //     ],
        // },
        // {
        //     title: "Community",
        //     url: "#",
        //     items: [
        //         {
        //             title: "Contribution Guide",
        //             url: "#",
        //         },
        //     ],
        // },
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
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">Documentation</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </a>
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
                                    <a href={item.url} className="font-medium">
                                        {item.title}
                                    </a>
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
                                                    <a href={subItem.url}>{subItem.title}</a>
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
