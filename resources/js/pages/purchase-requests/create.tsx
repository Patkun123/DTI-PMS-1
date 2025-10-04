import { Head, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
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
import { index as purchaseRequestsIndex, create as purchaseRequestsCreate, store as purchaseRequestsStore } from '@/routes/purchase-requests';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Purchase Requests',
        href: purchaseRequestsIndex().url,
    },
    {
        title: 'Create New Request',
        href: purchaseRequestsCreate().url,
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Purchase Request" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={purchaseRequestsIndex().url}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Purchase Requests
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Purchase Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={purchaseRequestsStore().url}
                            method="post"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="item_description">Item Description *</Label>
                                            <textarea
                                                id="item_description"
                                                name="item_description"
                                                rows={4}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter detailed description of the item"
                                                required
                                            />
                                        <InputError message={errors.item_description} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="stock_no ">Stock Number *</Label>
                                            <Input
                                                id="stock_no"
                                                name="stock_no"
                                                type="number"
                                                min="1"
                                                placeholder="Enter stock number"
                                                required
                                                className="bg-background"
                                            />
                                            <InputError message={errors.stock_no} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="unit">Unit *</Label>
                                            <Select name="unit">
                                                <SelectTrigger className="w-full bg-background">
                                                    <SelectValue placeholder="Select Unit" />
                                                </SelectTrigger>
                                                <SelectContent >
                                                    <SelectItem value="pc">Pc</SelectItem>
                                                    <SelectItem value="box">Box</SelectItem>
                                                    <SelectItem value="pack">Pack</SelectItem>
                                                    <SelectItem value="stock">Stock</SelectItem>
                                                    <SelectItem value="liter">Liter</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.unit} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity">Quantity *</Label>
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                min="1"
                                                placeholder="Enter quantity"
                                                required
                                                className="bg-background"
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
                                                placeholder="0.00"
                                                required
                                                className="bg-background"
                                            />
                                            <InputError message={errors.unit_cost} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select name="status">
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
                                                required
                                            />
                                            <InputError message={errors.requested_date} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="purpose">Purpose *</Label>
                                            <textarea
                                                id="purpose"
                                                name="purpose"
                                                rows={4}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter detailed description of the item"
                                                required
                                            />
                                        <InputError message={errors.item_description} />
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Creating...' : 'Create Purchase Request'}
                                        </Button>
                                        <Button variant="outline" type="button" asChild>
                                            <a href={purchaseRequestsIndex().url}>Cancel</a>
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

