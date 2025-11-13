import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Pencil, Trash } from "lucide-react"
import { Link } from "@inertiajs/react"
import { show as showRoute, edit as editRoute, destroy as destroyRoute } from "@/routes/ppmp"
import { router } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PpmpRow = {
  id: number
  ppmp_no: string
  ppmp_ref: string
  status_plan: string
  division: string
  status: string
  approved_date: string | null
  total: number
  allocated_budget: number
  used_budget: number
  remaining_budget: number
  budget_status: string
  details_count: number
  created_at: string
}

// Helper function to check if PPMP is usable
// UI-level: we no longer show a "locked" state — actions are visible for all rows.
const isUsablePpmp = (row: PpmpRow): boolean => {
  return true
}

export const columns: ColumnDef<PpmpRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "ppmp_no", header: "PPMP No." },
  {
    accessorKey: "ppmp_ref",
    header: "PPMP Reference",
    cell: ({ row }) => (
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        {row.getValue("ppmp_ref")}
      </span>
    ),
  },
  { accessorKey: "division", header: "Division" },
  { accessorKey: "status_plan", header: "Plan" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "details_count", header: "Sections" },
  {
    accessorKey: "allocated_budget",
    header: () => <div className="text-right">Allocated Budget</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("allocated_budget"))
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "used_budget",
    header: () => <div className="text-right">Used Budget</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("used_budget"))
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <div className="text-right font-medium text-orange-600">{formatted}</div>
    },
  },
  {
    accessorKey: "remaining_budget",
    header: () => <div className="text-right">Remaining Budget</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("remaining_budget"))
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      const colorClass = amount <= 0 ? "text-red-600" : amount < 10000 ? "text-yellow-600" : "text-green-600"
      return <div className={`text-right font-medium ${colorClass}`}>{formatted}</div>
    },
  },
  {
    accessorKey: "budget_status",
    header: "Budget Status",
    cell: ({ row }) => {
      const status = row.getValue("budget_status") as string
      const colorClass = status === "Exhausted" ? "bg-red-100 text-red-800" :
                        status === "Partially Used" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
      return (
        <span className={`px-2 py-1 rounded text-xs ${colorClass}`}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original as PpmpRow

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={showRoute(item.id).url} className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={editRoute(item.id).url} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Delete this PPMP?')) {
                  router.delete(destroyRoute(item.id).url, {
                    onSuccess: () => toast.success('PPMP deleted'),
                    onError: () => toast.error('Failed to delete PPMP'),
                  })
                }
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PpmpTable({ data, pagination }: { data: PpmpRow[]; pagination: any | null }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input placeholder="Filter by PPMP No..." className="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Page {pagination.current_page} of {pagination.last_page}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = pagination.prev_page_url)}
              disabled={!pagination.prev_page_url}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = pagination.next_page_url)}
              disabled={!pagination.next_page_url}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
