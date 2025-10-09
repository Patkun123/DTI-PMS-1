import { Head, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { create as purchaseRequestsCreate, index as purchaseRequestsIndex } from "@/routes/purchase-requests"
import PurchaseRequestsTable from "@/components/purchase-request/table-pr"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Purchase Requests",
    href: purchaseRequestsIndex().url,
  },
]

export default function Index({ purchaseRequests }: any) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Purchase Requests" />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
            <p className="text-muted-foreground">Manage and track all purchase requests</p>
          </div>
          <Link href={purchaseRequestsCreate().url}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>
        <PurchaseRequestsTable purchaseRequests={purchaseRequests} />
      </div>
    </AppLayout>
  )
}
