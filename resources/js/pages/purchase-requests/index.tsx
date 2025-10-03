import { Head, Link } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2, Printer, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index as purchaseRequestsIndex, create as purchaseRequestsCreate, show as purchaseRequestsShow, edit as purchaseRequestsEdit } from '@/routes/purchase-requests';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Requests',
        href: purchaseRequestsIndex().url,
    },
];

interface PurchaseRequest {
    id: number;
    pr_number: string;
    stock_no: number;
    item_description: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    status: 'pending' | 'approved';
    requested_date: string;
    user: {
        name: string;
    };
    created_at: string;
}

interface Props {
    purchaseRequests: {
        data: PurchaseRequest[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'default';
        case 'approved':
            return 'default';
        default:
            return 'secondary';
    }
};

export default function Index({ purchaseRequests }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
                        <p className="text-muted-foreground">
                            Manage and track all purchase requests
                        </p>
                    </div>
                    <Link href={purchaseRequestsCreate().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Request
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border bg-zinc-200  dark:bg-zinc-900 ">
                    <Table>
                        <TableHeader>
                            <TableRow >
                                <TableHead>PR Number</TableHead>
                                <TableHead>Stock No.</TableHead>
                                <TableHead>Item Description</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Division</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchaseRequests.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8">
                                        <div className="text-muted-foreground">
                                            <p>No purchase requests found.</p>
                                            <p className="text-sm">
                                                <Link
                                                    href={purchaseRequestsCreate().url}
                                                    className="text-primary hover:underline"
                                                >
                                                    Create your first purchase request
                                                </Link>
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                purchaseRequests.data.map((pr) => (
                                    <TableRow key={pr.id}>
                                        <TableCell className="max-w-xs truncate">
                                            {pr.pr_number}
                                        </TableCell>
                                        <TableCell>{pr.stock_no}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {pr.item_description}
                                        </TableCell>
                                        <TableCell>{pr.quantity}</TableCell>
                                        <TableCell >{pr.user.name}</TableCell>
                                        <TableCell>
                                            {new Date(pr.requested_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(pr.status)}>
                                                {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
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
                                            <DropdownMenuItem asChild>
                                                <a href={`/purchase-requests/${pr.id}/print`} target="_blank" className="flex items-center gap-2">
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
                                                onClick={() => console.log("Delete action for", pr.id)}
                                            >
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {purchaseRequests.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {((purchaseRequests.current_page - 1) * purchaseRequests.per_page) + 1} to{' '}
                            {Math.min(purchaseRequests.current_page * purchaseRequests.per_page, purchaseRequests.total)} of{' '}
                            {purchaseRequests.total} results
                        </p>
                        {/* Add pagination component here if needed */}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
