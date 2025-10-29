'use client'

import { useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent
} from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'

// 🧩 Giao diện 1 hành động
function ActionCollapse({ index }: { index: number }) {
  const [isOpen, setIsOpen] = useState(true)
  const [actionType, setActionType] = useState<'httprequest' | 'sendemail'>('httprequest')

  // giữ nguyên toàn bộ state HTTP Request gốc của bạn
  const [method, setMethod] = useState('POST')
  const [url, setUrl] = useState('')
  const [contentType, setContentType] = useState('application/json')
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
  const [bodyType, setBodyType] = useState<'json' | 'keyvalue'>('json')
  const [bodyJson, setBodyJson] = useState('')
  const [bodyPairs, setBodyPairs] = useState([{ key: '', value: '' }])
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'apikey'>('none')
  const [bearerToken, setBearerToken] = useState('')
  const [basicAuth, setBasicAuth] = useState({ username: '', password: '' })
  const [apiKeyAuth, setApiKeyAuth] = useState({ key: '', value: '', addTo: 'header' })
  const [order, setOrder] = useState(String(index + 1))
  const [preview, setPreview] = useState<any>(null)

  const addPair = () => setBodyPairs([...bodyPairs, { key: '', value: '' }])
  const updatePair = (i: number, field: 'key' | 'value', value: string) => {
    const copy = [...bodyPairs]
    copy[i][field] = value
    setBodyPairs(copy)
  }
  const removePair = (i: number) => setBodyPairs(bodyPairs.filter((_, x) => x !== i))

  const handleSend = () => {
    let parsedHeaders: Record<string, any> = {}
    try {
      parsedHeaders = JSON.parse(headers)
    } catch {
      parsedHeaders = { error: 'Invalid JSON in headers' }
    }

    if (authType === 'bearer' && bearerToken) {
      parsedHeaders['Authorization'] = `Bearer ${bearerToken}`
    }

    const bodyData =
      bodyType === 'json'
        ? (() => {
          try {
            return JSON.parse(bodyJson || '{}')
          } catch {
            return { error: 'Invalid JSON in body' }
          }
        })()
        : Object.fromEntries(
          bodyPairs.filter(p => p.key.trim() !== '').map(p => [p.key, p.value])
        )

    setPreview({
      method,
      url,
      headers: parsedHeaders,
      body: bodyData,
      authType,
    })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6 border rounded-md p-3">
      {/* Header collapse */}
      <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-md">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </Button>

          <Select value={actionType} onValueChange={(v: any) => setActionType(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn loại hành động" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="httprequest">HTTP Request</SelectItem>
              <SelectItem value="sendemail">Send Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label>#{index + 1}</Label>
      </div>

      {/* Nội dung collapse */}
      <CollapsibleContent className="mt-4 border-t pt-4 space-y-6">
        {actionType === 'httprequest' ? (
          <>
            {/* Cấu hình HTTP giữ nguyên toàn bộ */}
            <div className="space-y-3">
              <Label>Cấu hình HTTP Request</Label>
              <div className="flex gap-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="text"
                  placeholder="https://example.com/api"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <Tabs defaultValue="headers">
              <TabsList className="flex flex-wrap w-full">
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
              </TabsList>

              {/* Headers */}
              <TabsContent value="headers" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label>Headers (JSON)</Label>
                  <Textarea
                    rows={6}
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                  />
                </div>
              </TabsContent>

              {/* Body */}
              <TabsContent value="body" className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <Label>Kiểu Body</Label>
                  <Select
                    value={bodyType}
                    onValueChange={(v: 'json' | 'keyvalue') => setBodyType(v)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Chọn kiểu body" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="keyvalue">Key-Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {bodyType === 'json' ? (
                  <Textarea
                    rows={8}
                    placeholder={`{\n  "name": "John Doe"\n}`}
                    value={bodyJson}
                    onChange={(e) => setBodyJson(e.target.value)}
                  />
                ) : (
                  <div className="space-y-2">
                    {bodyPairs.map((pair, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={pair.key}
                          onChange={(e) => updatePair(i, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Value"
                          value={pair.value}
                          onChange={(e) => updatePair(i, 'value', e.target.value)}
                        />
                        <Button variant="destructive" onClick={() => removePair(i)}>✕</Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addPair}>+ Thêm dòng</Button>
                  </div>
                )}
              </TabsContent>

              {/* Auth */}
              <TabsContent value="auth" className="space-y-4 pt-4">
                <Label>Kiểu xác thực</Label>
                <Select value={authType} onValueChange={(v: any) => setAuthType(v)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn loại xác thực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không dùng</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="apikey">API Key</SelectItem>
                  </SelectContent>
                </Select>

                {authType === 'bearer' && (
                  <Input
                    placeholder="Bearer token"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                  />
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-2 border-t">
              <Button variant="outline" onClick={handleSend}>
                Gửi yêu cầu (Preview)
              </Button>
            </div>

            {preview && (
              <div className="mt-4">
                <Label>Kết quả xem trước:</Label>
                <ScrollArea className="max-h-[300px] mt-2 border rounded-md p-3 bg-background font-mono text-sm">
                  <pre>{JSON.stringify(preview, null, 2)}</pre>
                </ScrollArea>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Đây là giao diện Send Email</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

// 🧠 Component chính
export default function HttpRequest() {
  const [actions, setActions] = useState<number[]>([0])
  const addAction = () => setActions(prev => [...prev, prev.length])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Các hành động</CardTitle>
      </CardHeader>

      <CardContent>
        {actions.map((_, index) => (
          <ActionCollapse key={index} index={index} />
        ))}

        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={addAction} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm hành động
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}