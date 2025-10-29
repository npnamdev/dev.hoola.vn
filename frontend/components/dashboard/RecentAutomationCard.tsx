'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch, Plus, Zap, Activity, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import CreateAutomationDialog from '@/app/dashboard/automations/CreateAutomationDialog';

type Automation = {
    _id: string;
    name: string;
    description?: string;
    enabled: boolean;
    triggers?: any[];
    actions?: any[];
    runCount?: number;
    lastRun?: string;
    createdAt?: string;
};

export default function RecentAutomationCard() {
    const router = useRouter();
    const [createOpen, setCreateOpen] = useState(false);
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAutomations() {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${apiUrl}/api/automations`);
                const json = await res.json();

                if (json.success && Array.isArray(json.data)) {
                    // Lấy 3 cái mới nhất theo createdAt
                    const sorted = json.data.sort(
                        (a: Automation, b: Automation) =>
                            new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
                    );
                    setAutomations(sorted.slice(0, 3));
                } else {
                    setAutomations([]);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch automations');
                setAutomations([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAutomations();
    }, []);

    return (
        <>
            <Card className="lg:col-span-2 p-0 border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-[2px] gap-0">
                <CardHeader className="py-5 h-[60px] border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-md">
                            <GitBranch className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle className="text-13 font-semibold text-gray-800 mb-0.5">
                                Recent Automation
                            </CardTitle>
                            <CardDescription className="text-[12px] text-gray-500 font-semibold">
                                Các Automation gần đây
                            </CardDescription>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-lg hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => router.push('/dashboard/automations')}
                    >
                        Xem tất cả
                    </Button>
                </CardHeader>

                <CardContent className="p-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading...</div>
                    ) : automations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-4 mb-4">
                                <GitBranch className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-bold text-gray-700 mb-2">Chưa có Automation nào</p>
                            <p className="text-13 text-gray-500 mb-5">Bắt đầu tạo automation đầu tiên của bạn</p>
                            <Button size="sm" className="py-3" onClick={() => setCreateOpen(true)}>
                                <Plus className="h-4 w-4" />
                                <span className="text-13"> Tạo automation</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {automations.map((automation) => (
                                <Card
                                    key={automation._id}
                                    className="p-4 hover:shadow-sm cursor-pointer gap-0"
                                    onClick={() => router.push(`/dashboard/automations/${automation._id}`)}
                                >
                                    <h3 className="text-xs13 font-semibold text-gray-900 truncate">{automation.name}</h3>

                                    <div className="flex flex-wrap items-center gap-2  text-[11px] text-gray-600 mt-3">
                                        <Badge
                                            variant="outline"
                                            className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${automation.enabled
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {automation.enabled ? 'ACTIVE' : 'PAUSED'}
                                        </Badge>

                                        <div className="flex items-center gap-1">
                                            <Zap className="h-3 w-3" /> <span>{automation.triggers?.length || 0} triggers</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Activity className="h-3 w-3" /> <span>{automation.actions?.length || 0} actions</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> <span>{automation.runCount || 0} runs</span>
                                        </div>
                                        {automation.lastRun && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />{' '}
                                                <span>{new Date(automation.lastRun).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* {automation.createdAt && (
                                        <p className="text-[10px] text-gray-400">
                                            Created at: {new Date(automation.createdAt).toLocaleDateString()}
                                        </p>
                                    )} */}
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateAutomationDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={() => router.push(`/dashboard/automations`)}
            />
        </>
    );
}
