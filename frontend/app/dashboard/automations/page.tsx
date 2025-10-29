'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  Activity,
  TrendingUp,
  Clock,
  GitBranch,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import AutomationEditSheet from './AutomationEditSheet';
import CreateAutomationDialog from './CreateAutomationDialog';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function AutomationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const automationId = searchParams.get('automationId'); // lấy id từ URL

  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/automations`,
    fetcher
  );
  const automations = data?.data || [];

  const [createOpen, setCreateOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Mở sheet tự động nếu có automationId trên URL
  useEffect(() => {
    if (automationId) {
      setSheetOpen(true);
    } else {
      setSheetOpen(false);
    }
  }, [automationId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/automations/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Automation deleted successfully');
        mutate();
      } else {
        toast.error(data.message || 'Failed to delete automation');
      }
    } catch (err) {
      console.error('Error deleting automation:', err);
      toast.error('Error deleting automation');
    }
  };

  const handleToggleStatus = async (automation: any, newEnabled: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/automations/${automation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          newEnabled
            ? `"${automation.name}" has been activated.`
            : `"${automation.name}" has been paused.`
        );
        mutate();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Error updating automation status');
    }
  };

  if (isLoading)
    return <div className="flex items-center justify-center py-20">Loading...</div>;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 mb-3">Failed to load automations</p>
        <Button onClick={() => mutate()}>Retry</Button>
      </div>
    );

  return (
    <div className="px-5 py-4 space-y-5">
      {automations.length === 0 ? (
        <Card className="p-0 border border-gray-100 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-[2px]">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-18 text-center text-gray-500">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-4 mb-4">
                <GitBranch className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-2">
                Chưa có Automation nào
              </p>
              <p className="text-13 text-gray-500 mb-5">
                Bắt đầu tạo automation đầu tiên của bạn
              </p>
              <Button size="sm" className="py-3" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="text-13"> Tạo automation</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Automation List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map((automation: any) => (
              <Card
                key={automation._id}
                className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 p-0"
              >
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-13 font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {automation.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {automation.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 mt-4">
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${automation.enabled
                              ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200'
                            }`}
                        >
                          {automation.enabled ? 'ACTIVE' : 'PAUSED'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />{' '}
                          <span>{automation.triggers?.[0]?.type || 'No Trigger'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />{' '}
                          <span>{automation.actions?.length || 0} actions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />{' '}
                          <span>{automation.runCount || 0} runs</span>
                        </div>
                        {automation.lastRun && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{' '}
                            <span>{new Date(automation.lastRun).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="p-0 h-8 w-8 cursor-pointer">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[100px]">
                          <DropdownMenuItem
                            className="text-13"
                            onClick={() => {
                              // 🟢 Ghi automationId lên URL param
                              router.push(
                                `/dashboard/automations?automationId=${automation._id}`,
                                { scroll: false }
                              );
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" strokeWidth={1.5} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(automation._id)}
                            className="text-13"
                          >
                            <Trash2 className="mr-1 h-3 w-3" strokeWidth={1.5} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500 dark:text-gray-800">
                    Created at: {new Date(automation.createdAt).toLocaleDateString()}
                    <Switch
                      id={`switch-${automation._id}`}
                      checked={automation.enabled}
                      onCheckedChange={(checked) => handleToggleStatus(automation, checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 🟢 Sheet tự đọc id từ URL */}
      <AutomationEditSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) router.push('/dashboard/automations', { scroll: false });
        }}
        mutate={mutate}
      />

      <CreateAutomationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mutate={mutate}
      />
    </div>
  );
}
