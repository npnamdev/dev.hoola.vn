'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mutate?: () => void;
    onCreated?: (automationId: string) => void;
}

export default function CreateAutomationDialog({ open, onOpenChange, mutate, onCreated }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/automations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    triggers: [],
                    actions: [],
                    enabled: false,
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Automation created successfully');
                onOpenChange(false); // đóng modal
                setName('');
                setDescription('');
                mutate?.(); // refresh danh sách nếu parent có truyền mutate
                onCreated?.(data.data._id); // mở sheet nếu cần
            } else {
                toast.error(data.message || 'Failed to create automation');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error creating automation');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Tạo Automation mới</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Nhập tên và mô tả cho automation của bạn
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="automation-name">Tên Automation</Label>
                        <Input
                            id="automation-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên automation"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="automation-desc">Mô tả</Label>
                        <Textarea
                            id="automation-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về automation"
                            className="resize-none h-20"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button type="button" className="w-full" onClick={handleCreate}>
                        Tạo Automation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
