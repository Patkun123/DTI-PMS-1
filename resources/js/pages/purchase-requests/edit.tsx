import { Head, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index as purchaseRequestsIndex, show as purchaseRequestsShow, edit as purchaseRequestsEdit, update as purchaseRequestsUpdate } from '@/routes/purchase-requests';

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
}

interface Props {
    purchaseRequest: PurchaseRequest;
}

export default function Edit({ purchaseRequest }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Purchase Requests',
            href: purchaseRequestsIndex().url,
        },
        {
            title: purchaseRequest.pr_number,
            href: purchaseRequestsShow(purchaseRequest.id).url,
        },
        {
            title: 'Edit',
            href: purchaseRequestsEdit(purchaseRequest.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Purchase Request - ${purchaseRequest.pr_number}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={purchaseRequestsShow(purchaseRequest.id).url}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Purchase Request
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Purchase Request - {purchaseRequest.pr_number}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={purchaseRequestsUpdate(purchaseRequest.id).url}
                            method="put"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="stock_no">Stock Number *</Label>
                                            <Input
                                                id="stock_no"
                                                name="stock_no"
                                                type="number"
                                                min="1"
                                                defaultValue={purchaseRequest.stock_no}
                                                placeholder="Enter stock number"
                                                required
                                            />
                                            <InputError message={errors.stock_no} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Quantity *</Label>
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                min="1"
                                                defaultValue={purchaseRequest.quantity}
                                                placeholder="Enter quantity"
                                                required
                                            />
                                            <InputError message={errors.quantity} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="unit_cost">Unit Cost *</Label>
                                            <Input
                                                id="unit_cost"
                                                name="unit_cost"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={purchaseRequest.unit_cost}
                                                placeholder="0.00"
                                                required
                                            />
                                            <InputError message={errors.unit_cost} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="total_cost">Total Cost *</Label>
                                            <Input
                                                id="total_cost"
                                                name="total_cost"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={purchaseRequest.total_cost}
                                                placeholder="0.00"
                                                required
                                            />
                                            <InputError message={errors.total_cost} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select name="status" defaultValue={purchaseRequest.status}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="approved">Approved</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.status} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="requested_date">Requested Date *</Label>
                                            <Input
                                                id="requested_date"
                                                name="requested_date"
                                                type="date"
                                                defaultValue={purchaseRequest.requested_date}
                                                required
                                            />
                                            <InputError message={errors.requested_date} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="item_description">Item Description *</Label>
                                        <textarea
                                            id="item_description"
                                            name="item_description"
                                            rows={4}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            defaultValue={purchaseRequest.item_description}
                                            placeholder="Enter detailed description of the item"
                                            required
                                        />
                                        <InputError message={errors.item_description} />
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Purchase Request'}
                                        </Button>
                                        <Button variant="outline" type="button" asChild>
                                            <a href={purchaseRequestsShow(purchaseRequest.id).url}>Cancel</a>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}