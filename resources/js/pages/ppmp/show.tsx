import { Head, Link, usePage } from '@inertiajs/react'
import { ToastContainer, toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Printer, Calendar, DollarSign, Building, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { index as ppmpIndex, edit as editRoute } from '@/routes/ppmp'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const breadcrumbs = (ppmpNo: string): BreadcrumbItem[] => [
  { title: 'Project Procurement Management Plan', href: ppmpIndex().url },
  { title: ppmpNo, href: '#' },
]

export default function Show({ ppmp }: any) {
  const { props }: any = usePage()

  if (props.flash?.success) {
    toast.success(props.flash.success)
  }
  if (props.flash?.error) {
    toast.error(props.flash.error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'process':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />In Process</Badge>
      case 'utilized':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Utilized</Badge>
      case 'close':
        return <Badge variant="default" className="bg-red-100 text-red-800"><CheckCircle className="h-3 w-3 mr-1" />Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'final':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Final</Badge>
      case 'indicative':
        return <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Indicative</Badge>
      default:
        return <Badge variant="secondary">{plan}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateSectionTotal = (items: any[]) => {
    return items?.reduce((sum: number, item: any) => sum + Number(item.estimated_budget), 0) || 0
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs(ppmp.ppmp_no)}>
      <Head title={`PPMP ${ppmp.ppmp_no}`} />
      <ToastContainer />
      <div className="flex flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">PPMP {ppmp.ppmp_no}</h1>
              {getStatusBadge(ppmp.status)}
              {getPlanBadge(ppmp.status_plan)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{ppmp.division}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(ppmp.created_at).toLocaleDateString()}</span>
              </div>
              {ppmp.approved_date && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Approved: {new Date(ppmp.approved_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(`/ppmp/${ppmp.id}/print?autoprint=1`, '_blank')}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Link href={editRoute(ppmp.id).url}>
              <Button>Edit PPMP</Button>
            </Link>
          </div>
        </div>

        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Allocated Budget</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Number(ppmp.allocated_budget))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Used Budget</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(Number(ppmp.used_budget))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Remaining Budget</div>
                <div className={`text-2xl font-bold ${Number(ppmp.remaining_budget) > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(Number(ppmp.remaining_budget))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Budget Status</div>
                <div className="text-lg font-semibold">
                  {ppmp.budget_status === 'Available' && <Badge className="bg-green-100 text-green-800">Available</Badge>}
                  {ppmp.budget_status === 'Partially Used' && <Badge className="bg-yellow-100 text-yellow-800">Partially Used</Badge>}
                  {ppmp.budget_status === 'Exhausted' && <Badge className="bg-red-100 text-red-800">Exhausted</Badge>}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Estimated Budget</div>
                <div className="text-lg font-semibold">{formatCurrency(Number(ppmp.total))}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Sections</div>
                <div className="text-lg font-semibold">{ppmp.details?.length ?? 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">PPMP Reference</div>
                <div className="text-lg font-semibold font-mono">{ppmp.ppmp_ref}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Procurement Sections</h2>
          {ppmp.details?.map((detail: any, di: number) => (
            <Card key={detail.id ?? di} className="overflow-hidden">
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Section {di + 1}: {detail.general_description}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      PPMP Code: <span className="font-mono font-semibold">{detail.ppmp_code}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Budget Total</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(calculateSectionTotal(detail.items))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold">Item Description</th>
                        <th className="text-center p-4 font-semibold">Type</th>
                        <th className="text-center p-4 font-semibold">Quantity</th>
                        <th className="text-center p-4 font-semibold">Mode</th>
                        <th className="text-center p-4 font-semibold">PPC</th>
                        <th className="text-center p-4 font-semibold">Timeline</th>
                        <th className="text-center p-4 font-semibold">Source</th>
                        <th className="text-right p-4 font-semibold">Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items?.map((it: any, ii: number) => (
                        <tr key={it.id ?? ii} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-medium">{it.detail}</div>
                            {it.remarks && (
                              <div className="text-sm text-muted-foreground mt-1">{it.remarks}</div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">{it.type_project}</Badge>
                          </td>
                          <td className="p-4 text-center text-sm">{it.qty_size}</td>
                          <td className="p-4 text-center text-sm">{it.recommended}</td>
                          <td className="p-4 text-center">
                            <Badge variant={it.ppc === 'Yes' ? 'default' : 'secondary'}>
                              {it.ppc}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="text-sm">
                              <div>Start: {it.start_activity}</div>
                              <div>End: {it.end_activity}</div>
                              <div className="text-muted-foreground">Delivery: {it.expected_delivery}</div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="font-mono">{it.source_funds}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="font-semibold text-green-600">
                              {formatCurrency(Number(it.estimated_budget))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Ref: {it.ppmp_ref}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
