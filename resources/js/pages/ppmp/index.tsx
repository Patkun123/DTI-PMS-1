import { Head, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { create as Ppmpcreate, index as ppmpIndex } from "@/routes/ppmp"
import { PpmpData } from "@/components/ppmp/table"


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Project Procurement Management Plan",
    href: ppmpIndex().url,
  },
]

export default function Index({ purchaseRequests }: any) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Purchase Requests" />
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
        <PpmpData />
      </div>
    </AppLayout>
  )
}
