import { Head, Link, usePage } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { ToastContainer, toast } from 'react-toastify'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { create as Ppmpcreate, index as ppmpIndex } from "@/routes/ppmp"
import { PpmpTable } from "@/components/ppmp/table"


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Project Procurement Management Plan",
    href: ppmpIndex().url,
  },
]

export default function Index({ ppmp }: any) {
  const { props }: any = usePage()
  if (props.flash?.success) {
    toast.success(props.flash.success)
  }
  if (props.flash?.error) {
    toast.error(props.flash.error)
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Purchase Requests" />
      <ToastContainer />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Project Procurement Management Plan (PPMP)</h1>
            <p className="text-muted-foreground">Manage and track Plans</p>
          </div>
          <Link href={Ppmpcreate().url}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add new plan
            </Button>
          </Link>
        </div>
        <PpmpTable data={ppmp?.data ?? []} pagination={ppmp ?? null} />
      </div>
    </AppLayout>
  )
}
