import { Head, Form, useForm, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { index as ppmpIndex, update as updateRoute, show as showRoute } from '@/routes/ppmp'
import { Button } from '@/components/ui/button'
import { ToastContainer, toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  })

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
                  <Input value={data.status_plan} onChange={(e) => setData('status_plan', e.target.value)} />
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


