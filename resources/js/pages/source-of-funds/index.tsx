import { Head, Link, usePage, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { ToastContainer, toast } from 'react-toastify'
import { Plus, MoreHorizontal, Eye, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from "@/types"
import { create as SourceCreate, edit as SourceEdit, show as SourceShow } from "@/routes/source-of-funds"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const DIVISIONS = [
  { value: 'AFMD', label: 'AFMD' },
  { value: 'MSSD', label: 'MSSD' },
  { value: 'CPD', label: 'CPD' },
  { value: 'IDD', label: 'IDD' },
  { value: 'SDD', label: 'SDD' },
  { value: 'RAPID', label: 'RAPID' },
]

type SourceOfFund = {
  id: number
  name: string
  division: string
  description: string
  created_at: string
}

const columns: ColumnDef<SourceOfFund>[] = [
  {
    id: "rowNumber",
    header: "#",
    size: 60,
    cell: ({ row }) => (
      <div className="w-[30px] max-w-10 text-center text-xs">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Fund Name",
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "division",
    header: "Division",
    cell: ({ row }) => <div className="text-xs">{row.getValue("division") || '-'}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="text-xs truncate max-w-xs">{row.getValue("description") || '-'}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return <div className="text-xs">{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => {
      const item = row.original as SourceOfFund
      const [open, setOpen] = React.useState(false)

      const handleDelete = () => {
        router.delete(`/source-of-funds/${item.id}`, {
          onSuccess: () => {
            toast.success('Source of fund deleted successfully!')
            setOpen(false)
          },
          onError: () => {
            toast.error('Failed to delete source of fund.')
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
                <Link href={SourceEdit(item.id).url} className="flex items-center gap-2">
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
                <AlertDialogTitle>Delete Source of Fund</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this source of fund? This action cannot be undone.
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

function SourceOfFundsTable({ data }: { data: SourceOfFund[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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
          placeholder="Filter by fund name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
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
                  No source of funds found.
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

        <SourceOfFundsTable data={source_of_funds?.data || []} />
      </div>
    </AppLayout>
  )
}
