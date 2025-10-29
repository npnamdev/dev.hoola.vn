'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

type ActionItem = {
  id: string
  type: string
  open: boolean
}

function SortableAction({
  id,
  type,
  open,
  onDelete,
  onTypeChange,
}: ActionItem & { onDelete: (id: string) => void; onTypeChange: (id: string, type: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
      className="border border-border rounded-lg bg-white"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center px-4 h-12 cursor-pointer hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <button
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </button>

              <Select value={type} onValueChange={(v) => onTypeChange(id, v)}>
                <SelectTrigger className="w-[150px] text-13">
                  <SelectValue className="text-13" placeholder="Chọn loại hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="httprequest" className="text-13">HTTP Request</SelectItem>
                  <SelectItem value="sendemail" className="text-13">Send Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(id)
              }}
            >
              <Trash2 className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t p-4 space-y-3 bg-muted/30">
       {type === 'httprequest' && (
  <div className="space-y-4">
    {/* Request row */}
    <div className="grid grid-cols-[120px_auto] gap-2 items-center">
      <div>
        <Label className="text-13 mb-1 font-medium">Request</Label>
        <Select defaultValue="GET">
          <SelectTrigger className="w-full h-[36px] text-13">
            <SelectValue className="text-13" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-13" value="GET">GET</SelectItem>
            <SelectItem className="text-13" value="POST">POST</SelectItem>
            <SelectItem className="text-13" value="PUT">PUT</SelectItem>
            <SelectItem className="text-13" value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-13 mb-1 font-medium">URL</Label>
        <Input className="flex-1 h-[36px] text-13" placeholder="Enter request URL..." />
      </div>
    </div>

    {/* Tabs: Header, Body, Settings */}
    <Tabs defaultValue="header" className="space-y-2">
      <TabsList>
        <TabsTrigger value="header">Header</TabsTrigger>
        <TabsTrigger value="body">Body</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="header" className="p-2 border rounded-md bg-muted/20">
        {/* Nội dung header */}
        <div className="flex flex-col gap-2">
          <Label className="text-13 font-medium">Key</Label>
          <Input placeholder="Header key..." />
          <Label className="text-13 font-medium">Value</Label>
          <Input placeholder="Header value..." />
        </div>
      </TabsContent>

      <TabsContent value="body" className="p-2 border rounded-md bg-muted/20">
        {/* Nội dung body */}
        <Textarea placeholder="Request body..." className="text-13" />
      </TabsContent>

      <TabsContent value="settings" className="p-2 border rounded-md bg-muted/20">
        {/* Nội dung settings */}
        <div className="flex flex-col gap-2">
          <Label className="text-13 font-medium">Timeout (ms)</Label>
          <Input placeholder="5000" />
          <Label className="text-13 font-medium">Follow Redirects</Label>
          <Select defaultValue="true">
            <SelectTrigger className="w-[120px] text-13">
              <SelectValue className="text-13" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
    </Tabs>
  </div>
)}


          {type === 'sendemail' && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium">Email To</label>
                <Input className="text-13" placeholder="Recipient email..." />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium">Subject</label>
                <Input className="text-13" placeholder="Email subject..." />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-13 font-medium">Message</label>
                <Textarea className="text-13" placeholder="Email content..." rows={8} />
              </div>
            </div>
          )}

        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function HttpRequest() {
  const [actions, setActions] = useState<ActionItem[]>([])
  const sensors = useSensors(useSensor(PointerSensor))

  const handleAddAction = () => {
    const newAction: ActionItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'httprequest',
      open: false, // Mặc định collapse đóng
    }
    setActions((prev) => [...prev, newAction])
  }

  const handleDeleteAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id))
  }

  const handleTypeChange = (id: string, type: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, type } : a)))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = actions.findIndex((a) => a.id === active.id)
    const newIndex = actions.findIndex((a) => a.id === over.id)
    setActions((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  return (
    <Card className="shadow-sm border border-border/50 p-0 gap-0">
      <CardHeader className="flex justify-between items-center h-[60px] py-0 px-5">
        <CardTitle className="text-13 font-semibold flex items-center gap-2">
          🧰 Actions
          <Badge variant="secondary" className="text-xs">
            {actions.length}
          </Badge>
        </CardTitle>
        <Button size="sm" className="gap-1" onClick={handleAddAction}>
          <Plus className="h-4 w-4" />
          <span className="text-13">Add Action</span>
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3  px-5 py-4">
        {actions.length === 0 ? (
          <p className="text-muted-foreground italic text-13">
            No actions added yet. Click <strong>“Add Action”</strong> to create one.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={actions.map((a) => a.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5 mb-0">
                {actions.map((action) => (
                  <SortableAction
                    key={action.id}
                    {...action}
                    onDelete={handleDeleteAction}
                    onTypeChange={handleTypeChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
