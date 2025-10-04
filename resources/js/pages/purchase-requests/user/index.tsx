import * as React from "react"
import { Head, Link, usePage } from "@inertiajs/react"
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

import { Plus, Eye, Edit, Trash2, Printer, MoreHorizontal, ChevronDown, ArrowUpDown } from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  index as purchaseRequestsIndex,
  create as purchaseRequestsCreate,
  show as purchaseRequestsShow,
  edit as purchaseRequestsEdit,
} from "@/routes/purchase-requests"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Purchase Requests",
    href: purchaseRequestsIndex().url,
  },
]

interface PurchaseRequest {
  id: number
  pr_number: string
  stock_no: number
  item_description: string
  quantity: number
  unit_cost: number
  total_cost: number
  status: "pending" | "approved"
  requested_date: string
  user: {
    name: string
  }
  created_at: string
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

// 👉 Define the TanStack Table columns
export const columns: ColumnDef<PurchaseRequest>[] = [
    {
    id: "rowNumber",
    header: "#",
    size: 60, // 👈 preferred width in px
    cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        return (
        <div className="w-[30px] max-w-[40px] text-center">
            {pageIndex * pageSize + row.index + 1}
        </div>
        )
    },
    },
  {
    accessorKey: "pr_number",
    header: "PR Number",
    cell: ({ row }) => <div className="truncate max-w-xs ">{row.original.pr_number}</div>,
  },
  {
    accessorKey: "stock_no",
    header: "Stock No.",
  },
  {
    accessorKey: "item_description",
    header: "Item Description",
    cell: ({ row }) => <div className="truncate max-w-xs">{row.original.item_description}</div>,
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
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
             {authUser?.role === "user" && pr.status === "approved" && (
                <DropdownMenuItem asChild>
                    <a
                    href={`/purchase-requests/${pr.id}/print`}
                    target="_blank"
                    className="flex items-center gap-2"
                    >
                    <Printer className="h-4 w-4" /> Print
                    </a>
                </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={purchaseRequestsEdit(pr.id).url} className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => console.log("Delete action for", pr.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function Index({ purchaseRequests }: Props) {
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
    initialState:{
        pagination: {
            pageSize: 6,
        },
    },
  })

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Purchase Requests" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
            <p className="text-muted-foreground">Manage and track all purchase requests</p>
          </div>
        </div>

        {/* Filters + Columns toggle */}
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Filter item description..."
            value={(table.getColumn("item_description")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("item_description")?.setFilterValue(event.target.value)
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
            <Link href={purchaseRequestsCreate().url}>
                <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
                </Button>
            </Link>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-md border bg-zinc-200 dark:bg-zinc-900">
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

                {/* 👇 filler rows to keep table height fixed */}
                {Array.from({
                    length: table.getState().pagination.pageSize - table.getRowModel().rows.length,
                }).map((_, i) => (
                    <TableRow key={`empty-${i}`}>
                    <TableCell colSpan={columns.length} className="h-12" />
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

        {/* Pagination summary */}
        {purchaseRequests.last_page > 1 && (
          <div className="flex items-center justify-between py-2">
                <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
                    to{" "}
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
        )}
      </div>
    </AppLayout>
  )
}
