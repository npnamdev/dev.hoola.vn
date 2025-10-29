'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Clock, Plus, Trash2, Zap } from 'lucide-react';
import HttpRequest from '@/components/dashboard/HttpRequest';

interface Trigger {
    type: string;
    config: any;
}

interface Condition {
    field: string;
    operator: string;
    value: string;
}


interface Action {
    type: string;
    name: string;
    config: any;
}

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mutate?: () => void;
};

export default function AutomationEditSheet({ open, onOpenChange, mutate }: Props) {
    const searchParams = useSearchParams();
    const automationId = searchParams.get('automationId');
    const [automation, setAutomation] = useState({
        _id: '',
        name: '',
        description: '',
        enabled: false,
        conditionLogic: 'AND',
        triggers: [] as Trigger[],
        conditions: [] as Condition[],
        actions: [] as Action[],
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // 🧠 Fetch automation
    useEffect(() => {
        if (!automationId) return;
        const fetchAutomation = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const res = await fetch(
                    `${apiUrl}/api/automations/${automationId}`
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to load automation');
                setAutomation({
                    ...data.data,
                    conditions: data.data.conditions || [],
                });
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAutomation();
    }, [automationId]);

    // 💾 Save automation
    const handleSave = async () => {
        try {
            setSaving(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const res = await fetch(
                `${apiUrl}/api/automations/${automation._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(automation),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed');

            toast.success('Automation updated successfully!');
            if (typeof mutate === 'function') mutate();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };


    const handleTestAutomation = async () => {
        if (!automation._id) {
            toast.error('⚠️ Automation ID not found. Please save it first.')
            return
        }

        try {
            // Hiển thị thông báo đang chạy
            toast.loading('🚀 Running test automation...', { id: 'testAutomation' })

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/automations/${automation._id}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventData: { triggeredFrom: 'manual-test' }, // gửi thêm dữ liệu mẫu
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Test failed')
            }
            if (typeof mutate === 'function') mutate();
            toast.success(`✅ Test executed: ${data.message || 'Automation triggered'}`, { id: 'testAutomation' })
        } catch (error: any) {
            console.error('Test automation error:', error)
            toast.error(`❌ Failed to run test: ${error.message || 'Unknown error'}`, { id: 'testAutomation' })
        }
    }

    // 🔧 Utility functions (conditions & actions)
    const handleConditionChange = (
        i: number,
        key: keyof Condition,
        val: string
    ) => {
        const updated = [...automation.conditions];
        updated[i][key] = val;
        setAutomation({ ...automation, conditions: updated });
    };

    const addCondition = () =>
        setAutomation({
            ...automation,
            conditions: [
                ...automation.conditions,
                { field: '', operator: '=', value: '' },
            ],
        });

    const removeCondition = (i: number) =>
        setAutomation({
            ...automation,
            conditions: automation.conditions.filter((_, idx) => idx !== i),
        });

    const addAction = () =>
        setAutomation({
            ...automation,
            actions: [...automation.actions, { type: '', name: '', config: {} }],
        });

    const handleActionChange = (
        i: number,
        key: keyof Action,
        val: string | object
    ) => {
        const updated = [...automation.actions];
        updated[i][key] = val;
        setAutomation({ ...automation, actions: updated });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="min-w-[700px] overflow-y-auto bg-background"
            >
                <SheetHeader className="px-6 pt-4">
                    <SheetTitle className="text-base font-semibold">
                        ✨ {automationId ? 'Edit Automation' : 'New Automation'}
                    </SheetTitle>
                </SheetHeader>

                <div className="p-6 space-y-6">
                    {/* 🌟 CARD HEADER: Top Bar */}
                    <Card className="shadow-sm border border-border/50 p-0">
                        <CardHeader className="flex justify-between items-center h-[60px] py-0 px-4">
                            {/* Phải: Switch + Nút Test + Nút Save */}
                            <div className="flex items-center gap-3">
                                {/* Switch bật/tắt */}
                                <div className="flex items-center gap-2 mr-3">
                                    <Label htmlFor="enabled" className="text-13">
                                        Enabled
                                    </Label>
                                    <Switch
                                        id="enabled"
                                        checked={automation.enabled}
                                        onCheckedChange={(checked) =>
                                            setAutomation({ ...automation, enabled: checked })
                                        }
                                    />
                                </div>

                                {/* Nút Test Automation */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleTestAutomation}
                                >
                                    <span className="text-13">⚙️ Test Automation</span>
                                </Button>

                                {/* Nút Save */}
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    <span className="text-13">{saving ? 'Saving...' : 'Save Changes'}</span>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* 🧩 CARD: Basic Info */}
                    <Card className="shadow-sm border border-border/50 p-0 gap-0">
                        <CardHeader className="flex justify-between items-center h-[60px] py-0">
                            <CardTitle className="text-13 font-semibold flex items-center gap-2">
                                🧩 Basic Information
                            </CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-4 py-4 px-5">
                            {/* Automation Name */}
                            <div>
                                <Label className='text-13 mb-1'>Name</Label>
                                <Input
                                    value={automation.name}
                                    onChange={(e) => setAutomation({ ...automation, name: e.target.value })}
                                    placeholder="Enter automation name"
                                />
                            </div>

                            {/* Automation Description */}
                            <div>
                                <Label className='text-13 mb-1'>Description</Label>
                                <Textarea
                                    value={automation.description || ''}
                                    onChange={(e) => setAutomation({ ...automation, description: e.target.value })}
                                    placeholder="Describe what this automation does"
                                    className=" resize-none h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>


                    {/* ⚡ CARD: Triggers */}
                    <Card className="shadow-sm border border-border/50 p-0 gap-0">
                        <CardHeader className="flex justify-between items-center h-[60px] py-0 px-5">
                            <CardTitle className="text-13 font-semibold flex items-center gap-2">
                                ⚡ Triggers
                                <Badge variant="secondary" className="text-xs">
                                    {automation.triggers?.length || 0}
                                </Badge>
                            </CardTitle>
                            <Button
                                size="sm"
                                className="gap-1"
                                onClick={() =>
                                    setAutomation({
                                        ...automation,
                                        triggers: [...(automation.triggers || []), { type: 'any', config: {} }],
                                    })
                                }
                            >
                                <Plus className="h-4 w-4" />
                                <span className="text-13">Add Trigger</span>
                            </Button>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-4 py-4 px-5">
                            {automation.triggers.length === 0 && (
                                <p className="text-muted-foreground italic text-13">
                                    No triggers added yet. Click <strong>“Add Trigger”</strong> to begin.
                                </p>
                            )}

                            {automation.triggers.map((trigger, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-xl border border-border/50 bg-muted/30 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            {trigger.type === 'schedule' ? (
                                                <Clock className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <Zap className="h-4 w-4 text-amber-500" />
                                            )}
                                            <h4 className="text-sm font-medium text-foreground">
                                                Trigger #{index + 1}
                                            </h4>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => {
                                                const updated = automation.triggers.filter((_, i) => i !== index)
                                                setAutomation({ ...automation, triggers: updated })
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="mb-3">Trigger Type</Label>
                                            <Select
                                                value={trigger.type}
                                                onValueChange={(val) => {
                                                    const updated = [...automation.triggers]
                                                    updated[index] = { ...updated[index], type: val, config: {} }
                                                    setAutomation({ ...automation, triggers: updated })
                                                }}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select trigger type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem className="text-13" value="any">Any (run on any event)</SelectItem>
                                                    <SelectItem className="text-13" value="schedule">Schedule (run on cron)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {trigger.type === 'schedule' && (
                                            <div className="space-y-2">
                                                <Label>Cron Expression</Label>
                                                <Input
                                                    placeholder="e.g. * * * * * (every minute)"
                                                    value={trigger.config.cron || ''}
                                                    onChange={(e) => {
                                                        const updated = [...automation.triggers]
                                                        updated[index] = {
                                                            ...updated[index],
                                                            config: { ...updated[index].config, cron: e.target.value },
                                                        }
                                                        setAutomation({ ...automation, triggers: updated })
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Use standard cron syntax: * * * * * (min hour day month weekday)
                                                </p>
                                            </div>
                                        )}

                                        {trigger.type === 'any' && (
                                            <div className="text-xs text-muted-foreground italic">
                                                This trigger will activate on <strong>any event</strong>.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* 🧠 CARD: Conditions */}
                    <Card className="shadow-sm border border-border/50 p-0 gap-0">
                        <CardHeader className="flex justify-between items-center h-[60px] py-0 px-5">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-13 font-semibold flex items-center gap-2">
                                    🧠 Conditions
                                    <Badge variant="secondary" className="text-xs">
                                        {automation.conditions?.length || 0}
                                    </Badge>
                                </CardTitle>

                                {/* 🧩 Condition Logic Select (AND / OR) */}
                                <div className="flex items-center gap-2 ml-4">
                                    <Label className="text-13 text-muted-foreground">Logic</Label>
                                    <Select
                                        value={automation.conditionLogic}
                                        onValueChange={(val) => setAutomation({ ...automation, conditionLogic: val })}
                                    >
                                        <SelectTrigger className="h-8 w-[100px] text-13">
                                            <SelectValue className="text-13" placeholder="Logic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem className="text-13" value="AND">AND</SelectItem>
                                            <SelectItem className="text-13" value="OR">OR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* ➕ Add Condition Button */}
                            <Button size="sm" className="gap-1" onClick={addCondition}>
                                <Plus className="h-4 w-4" />
                                <span className="text-13">Add Condition</span>
                            </Button>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-4 py-4 px-5">
                            {automation.conditions.length === 0 && (
                                <p className="text-muted-foreground italic text-13">
                                    No conditions added yet. Click <strong>“Add Condition”</strong> to create one.
                                </p>
                            )}

                            {automation.conditions.map((cond, idx) => (
                                <div
                                    key={idx}
                                    className="relative rounded-xl border border-border/50 bg-muted/30 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-emerald-500" />
                                            <h4 className="text-sm font-medium text-foreground">
                                                Condition #{idx + 1}
                                            </h4>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => removeCondition(idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <Label>Field</Label>
                                            <Input
                                                value={cond.field}
                                                onChange={(e) => handleConditionChange(idx, 'field', e.target.value)}
                                                placeholder="Enter field name"
                                            />
                                        </div>

                                        <div>
                                            <Label>Operator</Label>
                                            <Select
                                                value={cond.operator}
                                                onValueChange={(val) => handleConditionChange(idx, 'operator', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select operator" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="=">=</SelectItem>
                                                    <SelectItem value="!=">!=</SelectItem>
                                                    <SelectItem value=">">&gt;</SelectItem>
                                                    <SelectItem value="<">&lt;</SelectItem>
                                                    <SelectItem value=">=">&gt;=</SelectItem>
                                                    <SelectItem value="<=">&lt;=</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Value</Label>
                                            <Input
                                                value={cond.value}
                                                onChange={(e) => handleConditionChange(idx, 'value', e.target.value)}
                                                placeholder="Enter comparison value"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>


                    {/* 🧰 CARD: Actions */}
                    <HttpRequest />


                    {/* 🧰 CARD: Actions */}
                    <Card className="shadow-sm border border-border/50 p-0 gap-0">
                        <CardHeader className="flex justify-between items-center h-[60px] py-0 px-5">
                            <CardTitle className="text-13 font-semibold flex items-center gap-2">
                                🧰 Actions
                                <Badge variant="secondary" className="text-xs">
                                    {automation.actions?.length || 0}
                                </Badge>
                            </CardTitle>
                            <Button size="sm" className="gap-1" onClick={addAction}>
                                <Plus className="h-4 w-4" />
                                <span className="text-13">Add Action</span>
                            </Button>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-4 py-4 px-5">
                            {/* Empty State */}
                            {automation.actions.length === 0 && (
                                <p className="text-muted-foreground italic text-13">
                                    No conditions added yet. Click <strong>“Add Condition”</strong> to create one.
                                </p>
                            )}

                            {/* Action Items */}
                            {automation.actions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="relative rounded-xl border border-border/50 bg-muted/30 p-5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`p-2 rounded-full ${action.type === 'http_request'
                                                    ? 'bg-indigo-100 text-indigo-600'
                                                    : 'bg-emerald-100 text-emerald-600'
                                                    }`}
                                            >
                                                {action.type === 'http_request' ? (
                                                    <Zap className="h-4 w-4" />
                                                ) : (
                                                    <Clock className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground">
                                                    Action #{idx + 1}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {action.type ? action.type.toUpperCase() : 'Unspecified type'}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                const updated = automation.actions.filter((_, i) => i !== idx)
                                                setAutomation({ ...automation, actions: updated })
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Body */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>Action Type</Label>
                                                <Select
                                                    value={action.type}
                                                    onValueChange={(val) => handleActionChange(idx, 'type', val)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select action type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="send_email">Send Email</SelectItem>
                                                        <SelectItem value="http_request">HTTP Request</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label>Action Name</Label>
                                                <Input
                                                    value={action.name}
                                                    onChange={(e) => handleActionChange(idx, 'name', e.target.value)}
                                                    placeholder="Enter action name"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Type: Email */}
                                        {action.type === 'send_email' && (
                                            <div className="space-y-2 mt-3">
                                                <Label>To</Label>
                                                <Input
                                                    value={action.config?.to || ''}
                                                    onChange={(e) =>
                                                        handleActionChange(idx, 'config', {
                                                            ...(action.config ?? {}),
                                                            to: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Recipient email"
                                                />

                                                <Label>Subject</Label>
                                                <Input
                                                    value={action.config?.subject || ''}
                                                    onChange={(e) =>
                                                        handleActionChange(idx, 'config', {
                                                            ...(action.config ?? {}),
                                                            subject: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Email subject"
                                                />

                                                <Label>Body</Label>
                                                <Textarea
                                                    value={action.config?.body || ''}
                                                    onChange={(e) =>
                                                        handleActionChange(idx, 'config', {
                                                            ...(action.config ?? {}),
                                                            body: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Email body"
                                                />
                                            </div>
                                        )}

                                        {/* Action Type: HTTP */}
                                        {action.type === 'http_request' && (
                                            <div className="space-y-2 mt-3">
                                                <Label>Method</Label>
                                                <Select
                                                    value={action.config?.method || 'POST'}
                                                    onValueChange={(val) =>
                                                        handleActionChange(idx, 'config', {
                                                            ...(action.config ?? {}),
                                                            method: val,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select HTTP method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="GET">GET</SelectItem>
                                                        <SelectItem value="POST">POST</SelectItem>
                                                        <SelectItem value="PUT">PUT</SelectItem>
                                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Label>URL</Label>
                                                <Input
                                                    value={action.config?.url || ''}
                                                    onChange={(e) =>
                                                        handleActionChange(idx, 'config', {
                                                            ...(action.config ?? {}),
                                                            url: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter request URL"
                                                />

                                                <Label>Headers (JSON)</Label>
                                                <Textarea
                                                    value={JSON.stringify(action.config?.headers || {}, null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const headers = JSON.parse(e.target.value || '{}')
                                                            handleActionChange(idx, 'config', {
                                                                ...(action.config ?? {}),
                                                                headers,
                                                            })
                                                        } catch {
                                                            toast.error('Invalid JSON for headers')
                                                        }
                                                    }}
                                                />

                                                <Label>Body (JSON)</Label>
                                                <Textarea
                                                    value={JSON.stringify(action.config?.body || {}, null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const body = JSON.parse(e.target.value || '{}')
                                                            handleActionChange(idx, 'config', {
                                                                ...(action.config ?? {}),
                                                                body,
                                                            })
                                                        } catch {
                                                            toast.error('Invalid JSON for body')
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </SheetContent>
        </Sheet>
    );
}