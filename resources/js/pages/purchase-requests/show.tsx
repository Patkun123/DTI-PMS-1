import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Calendar, User, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index as purchaseRequestsIndex, show as purchaseRequestsShow, edit as purchaseRequestsEdit } from '@/routes/purchase-requests';

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
        email: string;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    purchaseRequest: PurchaseRequest;
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

export default function Show({ purchaseRequest }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Purchase Requests',
            href: purchaseRequestsIndex().url,
        },
        {
            title: purchaseRequest.pr_number,
            href: purchaseRequestsShow(purchaseRequest.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Purchase Request - ${purchaseRequest.pr_number}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={purchaseRequestsIndex().url}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Purchase Requests
                            </Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={`/purchase-requests/${purchaseRequest.id}/print`} target="_blank">
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </a>
                        </Button>
                        <Link href={purchaseRequestsEdit(purchaseRequest.id).url}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{purchaseRequest.item_description}</CardTitle>
                                        <p className="text-muted-foreground mt-1">
                                            {purchaseRequest.pr_number}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getStatusColor(purchaseRequest.status)}>
                                            {purchaseRequest.status.charAt(0).toUpperCase() + purchaseRequest.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Item Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Stock Number</p>
                                            <p className="font-medium">{purchaseRequest.stock_no}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Quantity</p>
                                            <p className="font-medium">{purchaseRequest.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Unit Cost</p>
                                            <p className="font-medium">${purchaseRequest.unit_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Cost</p>
                                            <p className="font-medium">${purchaseRequest.total_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Request Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Requested Date</p>
                                        <p className="font-medium">
                                            {new Date(purchaseRequest.requested_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Requested By</p>
                                        <p className="font-medium">{purchaseRequest.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{purchaseRequest.user.email}</p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">
                                        {new Date(purchaseRequest.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">
                                        {new Date(purchaseRequest.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}