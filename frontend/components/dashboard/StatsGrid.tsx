import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Activity, CheckCircle2, Webhook } from 'lucide-react';

function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

type Automation = {
    _id: string;
    name: string;
    enabled: boolean;
    runCount?: number;
};

const StatsGrid = () => {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAutomations() {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const res = await fetch(`${apiUrl}/api/automations`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setAutomations(json.data);
                } else {
                    setAutomations([]);
                }
            } catch (err) {
                setAutomations([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAutomations();
    }, []);

    const total = automations.length;
    const active = automations.filter(a => a.enabled).length;
    const paused = automations.filter(a => !a.enabled).length;
    const totalRuns = automations.reduce((sum, a) => sum + (a.runCount || 0), 0);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-4 px-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 gap-3">
                <div className="absolute right-3 top-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-2 shadow-inner">
                    <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <CardHeader className='p-0'>
                    <CardTitle className="text-xs font-semibold text-gray-700 tracking-wide">
                        Total Automations
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    {loading ? (
                        <>
                            <Skeleton className="h-7 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-gray-900">{total}</div>
                            <p className="mt-4 font-semibold text-xs text-gray-500">Workflows created</p>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Đang hoạt động */}
            <Card className="relative overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-white via-green-50 to-emerald-100 p-4 px-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 gap-3">
                <div className="absolute right-3 top-3 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 p-2 shadow-inner">
                    <Zap className="h-4 w-4 text-emerald-600" />
                </div>
                <CardHeader className='p-0'>
                    <CardTitle className="text-xs font-semibold text-gray-700 tracking-wide">
                        Active
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'    >
                    {loading ? (
                        <>
                            <Skeleton className="h-7 w-16 mb-2" />
                            <Skeleton className="h-4 w-28" />
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-gray-900">{active}</div>
                            <p className="mt-4 font-semibold text-xs text-gray-500">Workflows running</p>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Tạm dừng */}
            <Card className="relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-br from-white via-yellow-50 to-yellow-100 p-4 px-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 gap-3">
                <div className="absolute right-3 top-3 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 p-2 shadow-inner">
                    <CheckCircle2 className="h-4 w-4 text-yellow-600" />
                </div>
                <CardHeader className='p-0'>
                    <CardTitle className="text-xs font-semibold text-gray-700 tracking-wide">
                        Paused
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    {loading ? (
                        <>
                            <Skeleton className="h-7 w-16 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-gray-900">{paused}</div>
                            <p className="mt-4 font-semibold text-xs text-gray-500">Workflows paused</p>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Tổng lượt chạy */}
            <Card className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-purple-100 p-4 px-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 gap-3">
                <div className="absolute right-3 top-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 shadow-inner">
                    <Webhook className="h-4 w-4 text-purple-600" />
                </div>
                <CardHeader className='p-0'>
                    <CardTitle className="text-xs font-semibold text-gray-700 tracking-wide">
                        Total Runs
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                    {loading ? (
                        <>
                            <Skeleton className="h-7 w-16 mb-2" />
                            <Skeleton className="h-4 w-36" />
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-gray-900">{totalRuns}</div>
                            <p className="mt-4 font-semibold text-xs text-gray-500">Total executions</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsGrid;
