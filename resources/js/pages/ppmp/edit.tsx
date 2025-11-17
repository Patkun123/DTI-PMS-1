import { Head, Form, useForm, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { index as ppmpIndex, update as updateRoute, show as showRoute } from '@/routes/ppmp'
import { Button } from '@/components/ui/button'
import { ToastContainer, toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'

const breadcrumbs = (ppmpNo: string): BreadcrumbItem[] => [
  { title: 'Project Procurement Management Plan', href: ppmpIndex().url },
  { title: ppmpNo, href: '#' },
  { title: 'Edit', href: '#' },
]

export default function Edit({ ppmp }: any) {
  const { data, setData, processing, put } = useForm({
    status_plan: ppmp.status_plan ?? 'indicative',
    status: ppmp.status ?? 'process',
    approved_date: ppmp.approved_date ?? '',
    details: ppmp.details ?? [],
  })

  const addDetail = () => {
    const newDetail = {
      id: undefined,
      general_description: '',
      items: [
        {
          id: undefined,
          detail: '',
          type_project: '',
          qty_size: '',
          recommended: '',
          ppc: '',
          start_activity: '',
          end_activity: '',
          expected_delivery: '',
          source_funds: 0,
          estimated_budget: 0,
          attached_support: '',
          remarks: '',
        },
      ],
    }
    setData('details', [...data.details, newDetail])
  }

  const addItem = (detailIndex: number) => {
    const newDetails = [...data.details]
    newDetails[detailIndex].items.push({
      id: undefined,
      detail: '',
      type_project: '',
      qty_size: '',
      recommended: '',
      ppc: '',
      start_activity: '',
      end_activity: '',
      expected_delivery: '',
      source_funds: 0,
      estimated_budget: 0,
      attached_support: '',
      remarks: '',
    })
    setData('details', newDetails)
  }

  const removeDetail = (detailIndex: number) => {
    const newDetails = data.details.filter((_: any, index: number) => index !== detailIndex)
    setData('details', newDetails)
  }

  const removeItem = (detailIndex: number, itemIndex: number) => {
    const newDetails = [...data.details]
    newDetails[detailIndex].items = newDetails[detailIndex].items.filter((_: any, index: number) => index !== itemIndex)
    setData('details', newDetails)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs(ppmp.ppmp_no)}>
      <Head title={`Edit PPMP ${ppmp.ppmp_no}`} />
      <ToastContainer />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit PPMP {ppmp.ppmp_no}</h1>
            <p className="text-muted-foreground">Division: {ppmp.division}</p>
          </div>
          <Link href={showRoute(ppmp.id).url}>
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                put(updateRoute(ppmp.id).url, {
                  onSuccess: () => toast.success('PPMP updated'),
                  onError: () => toast.error('Failed to update PPMP'),
                })
              }}
              action={updateRoute(ppmp.id).url}
              method="post"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Plan</Label>
                  <Select value={data.status_plan} onValueChange={(value) => setData('status_plan', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indicative">Indicative</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Input value={data.status} onChange={(e) => setData('status', e.target.value)} />
                </div>
                <div>
                  <Label>Approved Date</Label>
                  <Input type="date" value={data.approved_date ?? ''} onChange={(e) => setData('approved_date', e.target.value)} />
                </div>
              </div>

              {/* Procurement Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Procurement Sections</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addDetail}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Section
                  </Button>
                </div>

                {data.details.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sections added yet. Click "Add New Section" to get started.</p>
                ) : (
                  data.details.map((detail: any, detailIndex: number) => (
                    <Card key={detailIndex} className="bg-secondary/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Section {detailIndex + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDetail(detailIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-xs">General Description</Label>
                          <Textarea
                            value={detail.general_description}
                            onChange={(e) => {
                              const newDetails = [...data.details]
                              newDetails[detailIndex].general_description = e.target.value
                              setData('details', newDetails)
                            }}
                            placeholder="Enter section description"
                            rows={2}
                          />
                        </div>

                        {/* Items in Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Items</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addItem(detailIndex)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Item
                            </Button>
                          </div>

                          {detail.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="p-4 bg-white dark:bg-zinc-900 rounded border space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm">Procurement Item {itemIndex + 1}</span>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeItem(detailIndex, itemIndex)}
                                  disabled={detail.items.length === 1}
                                >
                                  Remove Item
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <Label className="text-xs mb-2">Object of Expenditure</Label>
                                  <Input
                                    value={item.detail}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].detail = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    placeholder="Enter product details"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Type of Project</Label>
                                  <Select
                                    value={item.type_project}
                                    onValueChange={(value) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].type_project = value
                                      setData('details', newDetails)
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Good">Goods</SelectItem>
                                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                      <SelectItem value="Consulting Service">Consulting Service</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Quantity/Size</Label>
                                  <Input
                                    value={item.qty_size}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].qty_size = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    placeholder="e.g., 10 units"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <Label className="text-xs mb-2">Recommended Mode</Label>
                                  <Select
                                    value={item.recommended}
                                    onValueChange={(value) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].recommended = value
                                      setData('details', newDetails)
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Direct Contracting">Direct Contracting</SelectItem>
                                      <SelectItem value="Direct Acquisition">Direct Acquisition</SelectItem>
                                      <SelectItem value="Competitive Bidding">Competitive Bidding</SelectItem>
                                      <SelectItem value="Small Value Procurement">Negotiated Procurement - Small Value</SelectItem>
                                      <SelectItem value="Emergency Cases Procurement">Negotiated Procurement - Emergency Cases</SelectItem>
                                      <SelectItem value="Lease of Real Property and Venue">Negotiated Procurement - Lease of Real Property and Venue</SelectItem>
                                      <SelectItem value="Direct Retail Purchase of Petroleum, Oil and Lubricant and Online Subscriptions">Negotiated Procurement - Direct Retail Purchase of POL & Subscriptions</SelectItem>
                                      <SelectItem value="Scholarly or Artistic Work, Exclusive Technology and Media Service">Negotiated Procurement - Scholarly/Artistic Work</SelectItem>
                                      <SelectItem value="Direct Procurement for Science, Technology, and Innovation">Direct Procurement - Science & Technology</SelectItem>
                                      <SelectItem value="Purchase of Common-Use Supplies not available in the Procurement Service">Purchase of Common-Use Supplies (Not in PS)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Pre-Procurement Conference</Label>
                                  <Select
                                    value={item.ppc}
                                    onValueChange={(value) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].ppc = value
                                      setData('details', newDetails)
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Yes/No" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Yes">Yes</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Start Activity</Label>
                                  <Input
                                    type="date"
                                    value={item.start_activity}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].start_activity = e.target.value
                                      setData('details', newDetails)
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">End Activity</Label>
                                  <Input
                                    type="date"
                                    value={item.end_activity}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].end_activity = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    min={item.start_activity || undefined}
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Expected Delivery (MM/YYYY - MM/YYYY)</Label>
                                  <Input
                                    value={item.expected_delivery}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].expected_delivery = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    placeholder="10/2025 - 12/2025"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <Label className="text-xs mb-2">Source of Funds</Label>
                                  <Input
                                    value={item.source_funds}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].source_funds = Number(e.target.value)
                                      setData('details', newDetails)
                                    }}
                                    placeholder="Enter source of funds"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs mb-2">Estimated Budget</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.estimated_budget}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].estimated_budget = Number(e.target.value)
                                      setData('details', newDetails)
                                    }}
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <Label className="text-xs mb-2">Attached Support</Label>
                                  <Input
                                    value={item.attached_support}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].attached_support = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    placeholder="Document reference"
                                  />
                                </div>

                                <div className="md:col-span-3">
                                  <Label className="text-xs mb-2">Remarks</Label>
                                  <Textarea
                                    value={item.remarks}
                                    onChange={(e) => {
                                      const newDetails = [...data.details]
                                      newDetails[detailIndex].items[itemIndex].remarks = e.target.value
                                      setData('details', newDetails)
                                    }}
                                    placeholder="Additional notes"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={processing}>Save</Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}


