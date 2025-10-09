import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, Printer } from "lucide-react"
import { Link, usePage, router } from "@inertiajs/react"
import { toast } from "react-toastify"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  index as purchaseRequestsIndex,
  show as purchaseRequestsShow,
  edit as purchaseRequestsEdit,
} from "@/routes/purchase-requests"

interface PurchaseRequestItem {
  id: number
  stock_no: number
  item_description: string
  quantity: number
  unit: string
  unit_cost: number
  total_cost: number
}

interface PurchaseRequest {
  id: number
  pr_number: string
  status: "pending" | "approved"
  requested_date: string
  purpose: string
  user: { name: string; email: string }
  items: PurchaseRequestItem[]
}

interface Props {
  purchaseRequests: {
    data: PurchaseRequest[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "approved":
      return "default"
    default:
      return "secondary"
  }
}

export const columns: ColumnDef<PurchaseRequest>[] = [
  {
    id: "rowNumber",
    header: "#",
    size: 60,
    cell: ({ row }) => (
      <div className="w-[30px] max-w-[40px] text-center">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "pr_number",
    header: "PR Number",
    cell: ({ row }) => <div className="truncate max-w-xs text-xs">{row.original.pr_number}</div>,
  },
  {
    accessorKey: "item_description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Item Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="truncate max-w-xs">{getValue<string>()}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue<string>(columnId) || ""
      return value.toLowerCase().includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "user.name",
    header: "Division",
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "requested_date",
    header: "Date",
    cell: ({ row }) => new Date(row.original.requested_date).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusColor(row.original.status)}>
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => {
      const pr = row.original
      const { props } = usePage()
      const authUser = (props as any).auth.user
      const [open, setOpen] = React.useState(false)

      const handleDelete = () => {
        router.delete(`/purchase-requests/${pr.id}`, {
          onSuccess: () => {
            toast.success("Purchase request deleted successfully!")
            setOpen(false)
          },
          onError: () => {
            toast.error("Failed to delete purchase request.")
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
                <Link href={purchaseRequestsShow(pr.id).url} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/purchase-requests/${pr.id}/print`}
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> Print
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={purchaseRequestsEdit(pr.id).url} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Purchase Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this purchase request? This action cannot be undone.
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

export default function PurchaseRequestsTable({ purchaseRequests }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: purchaseRequests.data,
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
          placeholder="Filter item description..."
          value={(table.getColumn("item_description")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("item_description")?.setFilterValue(e.target.value)
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
      <div className="max-h-[380px] rounded-md border bg-zinc-200 dark:bg-zinc-900 h-380">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No purchase requests found.
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
            purchaseRequests.data.length
          )}{" "}
          of {purchaseRequests.data.length} results
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
