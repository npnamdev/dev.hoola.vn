"use client"

import { useState, useMemo, ReactNode } from "react"
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
import { Button } from "@/components/ui/button"

interface AppLayoutProps {
    children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [selectedMenu, setSelectedMenu] = useState<string>("")

    // Dữ liệu menu
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
                "Gỡ khoá học khỏi tài khoản",
            ],
        },
        {
            title: "Architecture",
            items: [
                "Accessibility",
                "Fast Refresh",
                "Next.js Compiler",
                "Supported Browsers",
                "Turbopack",
            ],
        },
        {
            title: "Community",
            items: ["Contribution Guide"],
        },
    ]

    // Xác định breadcrumb động
    const breadcrumb = useMemo(() => {
        if (!selectedMenu) return []
        const parent = menuData.find(
            (m) => m.title === selectedMenu || m.items.includes(selectedMenu)
        )
        if (!parent) return []
        return parent.title === selectedMenu
            ? [parent.title]
            : [parent.title, selectedMenu]
    }, [selectedMenu])

    return (
        <SidebarProvider>
            <AppSidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
            <SidebarInset>
                {/* === Header === */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between px-5">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumb.length > 0 && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        {breadcrumb.map((item, i) => (
                                            <BreadcrumbItem key={i}>
                                                <BreadcrumbPage>{item}</BreadcrumbPage>
                                                {i < breadcrumb.length - 1 && (
                                                    <BreadcrumbSeparator className="hidden md:block" />
                                                )}
                                            </BreadcrumbItem>
                                        ))}
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center">
                        <Button>
                            <span className="text-13">Dùng thử</span>
                        </Button>
                    </div>
                </header>

                {/* === Nội dung trang === */}
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children ?? (
                        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center text-2xl font-bold">
                            {selectedMenu ? selectedMenu : "Chọn menu để hiển thị nội dung"}
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
