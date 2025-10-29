'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import RecentAutomationCard from '@/components/dashboard/RecentAutomationCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FileText,
    Webhook,
    Zap,
    Plus,
    CheckCircle2,
    Activity,
    GitBranch,
    Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateAutomationDialog from './automations/CreateAutomationDialog';
import StatsGrid from '@/components/dashboard/StatsGrid';

type Automation = {
    _id: string;
    name: string;
    description?: string;
    enabled: boolean;
    runCount?: number;
    successRate?: string;
    lastRun?: string;
    createdAt?: string;
};

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);

    // Hàm mở modal tạo automation qua window event
    const openCreateAutomationModal = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-create-automation-modal'));
        }
    };

    useEffect(() => {
        async function fetchAutomations() {
            try {
                setLoading(true);
                // Use internal API route in Next.js, do not change to external API URL
                const res = await fetch('/api/automation');
                const data = await res.json();
                setAutomations(Array.isArray(data) ? data : []);
            } catch (err) {
                setAutomations([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAutomations();
    }, []);

    if (!user) {
        return null;
    }

    // Stats
    const activeCount = automations.filter(a => a.enabled).length;
    const totalExecutions = automations.reduce((sum, a) => sum + (a.runCount || 0), 0);
    const successRate = automations.length > 0 ? (
        (automations.reduce((sum, a) => sum + (parseFloat(a.successRate ?? '0') || 0), 0) / automations.length).toFixed(2)
    ) : '0.00';

    return (
        <div className="px-5 py-4 space-y-5">
            {/* Stats Grid */}
            <StatsGrid />


            <div className="grid gap-4 lg:grid-cols-3">
                {/* Recent Automation */}
                <RecentAutomationCard />
                {/* Recent Workflows */}


                {/* Quick Start */}
                <Card className="border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] p-0 gap-0">
                    <CardHeader className="py-5 h-[60px] border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-50 rounded-md">
                                <Zap className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                                <CardTitle className="text-13 font-semibold text-gray-800 mb-0.5">
                                    Quick Start
                                </CardTitle>
                                <CardDescription className="text-[12px] text-gray-500 font-semibold">
                                    Bắt đầu nhanh
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4 px-4 py-4">
                        {/* Tạo Automation */}
                        <div
                            className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-gradient-to-r from-white via-yellow-50 to-yellow-100 p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                            onClick={openCreateAutomationModal}
                        >
                            <Zap className="h-4 w-4 text-yellow-700" />
                            <div>
                                <div className="font-semibold text-xs text-yellow-900 mb-0.5">Tạo Automation</div>
                                <div className="text-[12px] text-gray-600">Tạo workflow tự động hóa mới</div>
                            </div>
                        </div>
                        {/* Workflow mẫu */}
                        <div
                            className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50 to-emerald-100 p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                            onClick={() => router.push('/dashboard/automations/templates')}
                        >
                            <GitBranch className="h-4 w-4 text-emerald-700" />
                            <div>
                                <div className="font-semibold text-xs text-emerald-900 mb-0.5">Workflow mẫu</div>
                                <div className="text-[12px] text-gray-600">Khám phá các template có sẵn</div>
                            </div>
                        </div>
                        {/* Kết nối App/Integration */}
                        <div
                            className="flex items-center gap-3 rounded-xl border border-purple-100 bg-gradient-to-r from-white via-purple-50 to-purple-100 p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                            onClick={() => router.push('/dashboard/integrations')}
                        >
                            <Webhook className="h-4 w-4 text-purple-700" />
                            <div>
                                <div className="font-semibold text-xs text-purple-900 mb-0.5">Kết nối App</div>
                                <div className="text-[12px] text-gray-600">Thêm integration mới</div>
                            </div>
                        </div>
                        {/* Lịch sử thực thi */}
                        <div
                            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gradient-to-r from-white via-gray-50 to-gray-100 p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                            onClick={() => router.push('/dashboard/executions')}
                        >
                            <Clock className="h-4 w-4 text-gray-700" />
                            <div>
                                <div className="font-semibold text-xs text-gray-900 mb-0.5">Lịch sử thực thi</div>
                                <div className="text-[12px] text-gray-600">Xem lại các lần chạy gần đây</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Recent Executions */}
            <Card className="rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] p-0">
                <CardHeader className="py-3 h-[60px] border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-md">
                                <Activity className="h-4 w-4 text-blue-600" strokeWidth={2} />
                            </div>
                            <div>
                                <CardTitle className="text-13 font-semibold text-gray-800 mb-0.5">
                                    Recent Executions
                                </CardTitle>
                                <CardDescription className="text-[12px] text-gray-500 font-semibold">
                                    Lịch sử thực thi gần đây
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => router.push('/dashboard/executions')}
                        >
                            <span className="flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5" strokeWidth={1.5} />
                                Xem logs
                            </span>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <div className="bg-gray-50 rounded-full p-3 mb-3">
                            <Clock className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm basefont-bold text-gray-700 mb-3">
                            Chưa có execution nào
                        </p>
                        <p className="text-xs text-gray-500 text-center max-w-xs font-semibold">
                            Workflows của bạn sẽ hiển thị ở đây sau khi chạy
                        </p>
                        <Button
                            size="sm"
                            className="mt-6 py-3"
                            onClick={() => router.push('/dashboard/automations')}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-13"> Tạo Workflow đầu tiên</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>



        </div>
    );
}
