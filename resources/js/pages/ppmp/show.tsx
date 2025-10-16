import { Head, Link, usePage } from '@inertiajs/react'
import { ToastContainer, toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { index as ppmpIndex, edit as editRoute } from '@/routes/ppmp'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

  const handlePrint = () => {
    // Open print page in new window
    window.open(`/ppmp/${ppmp.id}/print?autoprint=1`, '_blank')
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs(ppmp.ppmp_no)}>
      <Head title={`PPMP ${ppmp.ppmp_no}`} />
      <ToastContainer />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">PPMP {ppmp.ppmp_no}</h1>
            <p className="text-muted-foreground">
              Division: {ppmp.division} • Plan: {ppmp.status_plan} • Status: {ppmp.status}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Link href={editRoute(ppmp.id).url}>
              <Button>Edit</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Approved Date</div>
                <div>{ppmp.approved_date ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
                <div>
                  {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(ppmp.total))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sections</div>
                <div>{ppmp.details?.length ?? 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {ppmp.details?.map((detail: any, di: number) => (
          <Card key={detail.id ?? di}>
            <CardHeader>
              <CardTitle>Section {di + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">General Description</div>
                <div className="whitespace-pre-line">{detail.general_description}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Type</th>
                      <th className="p-2">Qty/Size</th>
                      <th className="p-2">Mode</th>
                      <th className="p-2">PPC</th>
                      <th className="p-2">Start</th>
                      <th className="p-2">End</th>
                      <th className="p-2">Delivery</th>
                      <th className="p-2">Funds</th>
                      <th className="p-2 text-right">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items?.map((it: any, ii: number) => (
                      <tr key={it.id ?? ii} className="border-b">
                        <td className="p-2">{it.type_project}</td>
                        <td className="p-2">{it.qty_size}</td>
                        <td className="p-2">{it.recommended}</td>
                        <td className="p-2">{it.ppc}</td>
                        <td className="p-2">{it.start_activity}</td>
                        <td className="p-2">{it.end_activity}</td>
                        <td className="p-2">{it.expected_delivery}</td>
                        <td className="p-2">{it.source_funds}</td>
                        <td className="p-2 text-right">
                          {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(it.estimated_budget))}
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
    </AppLayout>
  )
}
