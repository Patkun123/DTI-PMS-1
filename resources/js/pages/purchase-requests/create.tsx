import { Head, Form, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index as purchaseRequestsIndex, create as purchaseRequestsCreate, store as purchaseRequestsStore } from '@/routes/purchase-requests';
import React from 'react';

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

export default function Create({ availablePpmps }: { availablePpmps: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        ppmp_id: '',
        requested_date: new Date().toISOString().split('T')[0], // Default to today
        purpose: '',
        ris_status: '',
        items: [{
            item_description: '',
            unit: '',
            quantity: 1,
            unit_cost: 1,
        }],
    });

    const addItem = () => {
        setData('items', [...data.items, {
            item_description: '',
            unit: '',
            quantity: 1,
            unit_cost: 0,
        }]);
    };

    const removeItem = (index: number) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(purchaseRequestsStore().url, {
            onSuccess: () => toast.success('Purchase request created successfully!'),
            onError: () => toast.error('Failed to create purchase request'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Purchase Request" />
            <ToastContainer />
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
                            className="space-y-6">
                            
                            {/* PPMP Selection */}
                            <div>
                                <Label htmlFor="ppmp_id">PPMP Reference *</Label>
                                <Select
                                    name="ppmp_id"
                                    value={data.ppmp_id}
                                    onValueChange={(value) => setData('ppmp_id', value)}
                                    required
                                >
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Select PPMP Reference" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePpmps.map((ppmp) => (
                                            <SelectItem key={ppmp.id} value={ppmp.id.toString()}>
                                                {ppmp.ppmp_ref} - {ppmp.ppmp_no} 
                                                (Budget: ₱{ppmp.allocated_budget.toLocaleString()} | 
                                                Used: ₱{ppmp.used_budget.toLocaleString()} | 
                                                Remaining: ₱{ppmp.remaining_budget.toLocaleString()})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.ppmp_id} />
                                {availablePpmps.length === 0 && (
                                    <p className="text-sm text-red-600 mt-1">
                                        No available PPMP found. Please create a PPMP first.
                                    </p>
                                )}
                            </div>

                            {/* Requested Date */}
                            <div>
                                <Label htmlFor="requested_date">Requested Date</Label>
                                <Input
                                    id="requested_date"
                                    type="date"
                                    name="requested_date"
                                    value={data.requested_date}
                                    onChange={(e) => setData('requested_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.requested_date} />
                            </div>
                            <div>
                                <Label htmlFor="ris_status">with RIS</Label>
                                <Select name="ris_status">
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Select RIS" />
                                    </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="with">With</SelectItem>
                                            <SelectItem value="none">None</SelectItem>
                                        </SelectContent>
                                </Select>
                                <InputError message={errors.ris_status} />
                            </div>

                            {/* Purpose */}
                            <div>
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea
                                    id="purpose"
                                    name="purpose"
                                    value={data.purpose}
                                    onChange={(e) => setData('purpose', e.target.value)}
                                    placeholder="Enter the purpose of the purchase request"
                                    required
                                />
                                <InputError message={errors.purpose} />
                            </div>

                            {/* Items */}
                            {data.items.map((item, index) => (
                                <div key={index} className="h-full mb-2">
                                    <div className="mb-5">
                                        <Label htmlFor={`item_description_${index}`}>Item Description</Label>
                                        <Textarea
                                            id={`item_description_${index}`}
                                            name={`items[${index}][item_description]`}
                                            value={item.item_description}
                                            onChange={(e) => setData('items', data.items.map((i, idx) =>
                                                idx === index ? { ...i, item_description: e.target.value } : i
                                            ))}
                                            placeholder="Item description"
                                            required

                                        />
                                        <InputError message={errors[`items.${index}.item_description`]} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                                        <div>
                                            <Label htmlFor={`unit_${index}`}>Unit</Label>
                                            <Select
                                                name={`items[${index}][unit]`}
                                                value={item.unit}
                                                onValueChange={(value) => setData('items', data.items.map((i, idx) =>
                                                    idx === index ? { ...i, unit: value } : i
                                                ))}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pc">Pc</SelectItem>
                                                    <SelectItem value="box">Box</SelectItem>
                                                    <SelectItem value="pack">Pack</SelectItem>
                                                    <SelectItem value="stock">Stock</SelectItem>
                                                    <SelectItem value="liter">Liter</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors[`items.${index}.unit`]} />
                                        </div>
                                        <Input
                                            id={`stock_no_${index}`}
                                            type="number"
                                            name={`items[${index}][stock_no]`}
                                            value={index + 1}
                                            readOnly
                                            hidden
                                        />
                                    <div>
                                        <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                                        <Input
                                            id={`quantity_${index}`}
                                            type="number"
                                            name={`items[${index}][quantity]`}
                                            value={item.quantity}
                                            onChange={(e) => setData('items', data.items.map((i, idx) =>
                                                idx === index ? { ...i, quantity: Number(e.target.value) } : i
                                            ))}
                                            placeholder="Quantity"
                                            min="1"
                                            required
                                        />
                                        <InputError message={errors[`items.${index}.quantity`]} />
                                    </div>

                                    <div>
                                        <Label htmlFor={`unit_cost_${index}`}>Unit Cost</Label>
                                        <Input
                                            id={`unit_cost_${index}`}
                                            type="number"
                                            name={`items[${index}][unit_cost]`}
                                            value={item.unit_cost}
                                            onChange={(e) => setData('items', data.items.map((i, idx) =>
                                                idx === index ? { ...i, unit_cost: Number(e.target.value) } : i
                                            ))}
                                            placeholder="Unit Cost"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        <InputError message={errors[`items.${index}.unit_cost`]} />
                                    </div>

                                    {data.items.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => removeItem(index)}
                                            className="mt-8"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                </div>
                            ))}

                            <div className="flex gap-4 mt-10 justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addItem}
                                    disabled={processing}
                                >
                                    Add Item
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Purchase Request'}
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
