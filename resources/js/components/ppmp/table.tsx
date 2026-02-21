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
import { Link, router } from "@inertiajs/react"
import { show as showRoute, edit as editRoute, destroy as destroyRoute } from "@/routes/ppmp"
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
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

// Helper function to format status display
const getStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    'process': 'Work in Progress',
    'utilized': 'Partially Utilized',
    'close': 'Closed',
  }
  return statusMap[status] || status
}

// Helper function to get status color class
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'process':
      return 'secondary'
    case 'utilized':
      return 'default'
    case 'close':
      return 'destructive'
    default:
      return 'default'
  }
}

export const columns: ColumnDef<PpmpRow>[] = [
  {
    id: "rowNumber",
    header: "#",
    size: 60,
    cell: ({ row }) => (
      <div className="w-[30px] max-w-[40px] text-center text-xs">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "ppmp_no",
    header: "PPMP No.",
    cell: ({ row }) => <div className="text-xs">{row.getValue("ppmp_no")}</div>,
  },
  {
    accessorKey: "ppmp_ref",
    header: "PPMP Reference",
    cell: ({ row }) => (
      <div className="text-xs">
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {row.getValue("ppmp_ref")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => <div className="text-xs">{row.getValue("division")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const color = getStatusColor(status)
      return (
        <Badge
          variant={color as any}
          className={
            color === "secondary"
              ? "bg-yellow-500 dark:text-black text-white hover:bg-yellow-600 text-xs"
              : color === "default"
              ? "bg-green-500 dark:text-black text-white hover:bg-green-600 text-xs"
              : "bg-red-500 dark:text-black text-white hover:bg-red-600 text-xs"
          }
        >
          {getStatusDisplay(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "allocated_budget",
    header: () => <div className="text-right">Allocated Budget</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("allocated_budget"))
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
      return <div className="text-right text-xs font-medium">{formatted}</div>
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
      return <div className="text-right text-xs font-medium text-orange-600">{formatted}</div>
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
      return <div className={`text-right text-xs font-medium ${colorClass}`}>{formatted}</div>
    },
  },
  {
    accessorKey: "budget_status",
    header: "Budget Status",
    cell: ({ row }) => {
      const status = row.getValue("budget_status") as string
      const colorClass = status === "Exhausted" ? "bg-red-100 text-red-800" :
                        status === "Partially Used" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800 "
      return (
        <Badge variant="outline" className={`text-xs ${colorClass}`}>
          {status}
        </Badge>
      )
    },
  },
//   {
//     accessorKey: "created_at",
//     header: "Created Date",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("created_at") as string)
//       return <div className="text-xs">{date.toLocaleDateString()}</div>
//     },
//   },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => {
      const item = row.original as PpmpRow
      const [open, setOpen] = React.useState(false)

      const handleDelete = () => {
        router.delete(destroyRoute(item.id).url, {
          onSuccess: () => {
            toast.success('PPMP deleted successfully!')
            setOpen(false)
          },
          onError: () => {
            toast.error('Failed to delete PPMP.')
          },
        })
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                className="text-red-600 focus:text-red-600"
                onClick={() => setOpen(true)}
              >
                <Trash className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete PPMP</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this PPMP? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
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

  const handleYearFilter = (year: string) => {
    const currentUrl = new URL(window.location.href)
    if (year === 'all') {
      currentUrl.searchParams.delete('year')
    } else {
      currentUrl.searchParams.set('year', year)
    }
    router.get(currentUrl.pathname + currentUrl.search, {}, {
      preserveState: true,
      preserveScroll: true,
    })
  }

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
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 7,
      },
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filter + Columns toggle */}
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter by PPMP No..."
          value={(table.getColumn("ppmp_no")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("ppmp_no")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="max-h-[480px] rounded-md border bg-zinc-50 dark:bg-zinc-900 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
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
              <>
                {table.getRowModel().rows.map((row) => (
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
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No PPMP plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{" "}
          of {data.length} results
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
