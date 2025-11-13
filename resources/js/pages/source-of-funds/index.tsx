import { Head, Link, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { ToastContainer, toast } from 'react-toastify'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { create as SourceCreate } from "@/routes/source-of-funds"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DIVISIONS = [
  { value: 'AFMD', label: 'AFMD' },
  { value: 'MSSD', label: 'MSSD' },
  { value: 'CPD', label: 'CPD' },
  { value: 'IDD', label: 'IDD' },
  { value: 'SDD', label: 'SDD' },
  { value: 'RAPID', label: 'RAPID' },
]

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Source of Funds",
    href: '/source-of-funds',
  },
]

export default function Index({ source_of_funds, divisions }: any) {
  const { props }: any = usePage()

  const handleDivisionChange = (value: string) => {
    if (value === 'all') {
      router.get('/source-of-funds')
    } else {
      router.get('/source-of-funds', { division: value })
    }
  }

  const currentDivision = props.ziggy?.query?.division || 'all'

  if (props.flash?.success) {
    toast.success(props.flash.success)
  }
  if (props.flash?.error) {
    toast.error(props.flash.error)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Source of Funds" />
      <ToastContainer />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Source of Funds</h1>
            <p className="text-muted-foreground">Manage source of funds per division</p>
          </div>
          <Link href={SourceCreate().url}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add source
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-48">
            <label className="text-sm font-medium mb-2 block">Filter by Division</label>
            <Select value={currentDivision} onValueChange={handleDivisionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {DIVISIONS.map((division) => (
                  <SelectItem key={division.value} value={division.value}>
                    {division.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm font-medium text-muted-foreground">
                <th className="py-2">No.</th>
                <th className="py-2">Name</th>
                <th className="py-2">Division</th>
                <th className="py-2">Description</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {source_of_funds?.data?.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2">{item.id}</td>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.division ?? '-'}</td>
                  <td className="py-2">{item.description ?? ''}</td>
                  <td className="py-2">
                    <Link href={`/source-of-funds/${item.id}/edit`} className="text-sm text-primary">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
