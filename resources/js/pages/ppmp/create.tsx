import { Head, useForm } from '@inertiajs/react';
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
import { index as ppmpIndex, create as Ppmpcreate, store as Ppmpstore } from '@/routes/ppmp';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Procurement Management Plan',
        href: ppmpIndex().url,
    },
    {
        title: 'Create New Plan',
        href: Ppmpcreate().url,
    },
];

interface PpmpItem {
    detail: string;
    type_project: string;
    qty_size: string;
    recommended: string;
    ppc: string;
    start_activity: string;
    end_activity: string;
    expected_delivery: string;
    source_funds: string;
    estimated_budget: number;
    attached_support: string;
    remarks: string;
}

interface PpmpDetail {
    general_description: string;
    items: PpmpItem[];
}

interface PpmpFormData {
    ppmp_no: string;
    status_plan: string;
    allocated_budget: number;
    approved_date: string | null;
    details: PpmpDetail[];
}

export default function Create({ proposed_ppmp_no }: any) {
    const { data, setData, post, processing, errors } = useForm<PpmpFormData>({
        ppmp_no: proposed_ppmp_no ?? '',
        status_plan: 'indicative',
        allocated_budget: 0,
        approved_date: null,
        details: [{
            general_description: '',
            items: [{
                detail: '',
                type_project: '',
                qty_size: '',
                recommended: '',
                ppc: '',
                start_activity: '',
                end_activity: '',
                expected_delivery: '',
                source_funds: '',
                estimated_budget: 0,
                attached_support: '',
                remarks: '',
            }],
        }],
    });

    const addDetail = () => {
        setData('details', [
            ...data.details,
            {
                general_description: '',
                items: [{
                    detail: '',
                    type_project: '',
                    qty_size: '',
                    recommended: '',
                    ppc: '',
                    start_activity: '',
                    end_activity: '',
                    expected_delivery: '',
                    source_funds: '',
                    estimated_budget: 0,
                    attached_support: '',
                    remarks: '',
                }],
            },
        ]);
    };

    const removeDetail = (detailIndex: number) => {
        if (window.confirm('Are you sure you want to remove this section?')) {
            setData('details', data.details.filter((_, i) => i !== detailIndex));
        }
    };

    const addItem = (detailIndex: number) => {
        const newDetails = [...data.details];
        newDetails[detailIndex].items.push({
            detail: '',
            type_project: '',
            qty_size: '',
            recommended: '',
            ppc: '',
            start_activity: '',
            end_activity: '',
            expected_delivery: '',
            source_funds: '',
            estimated_budget: 0,
            attached_support: '',
            remarks: '',
        });
        setData('details', newDetails);
    };

    const removeItem = (detailIndex: number, itemIndex: number) => {
        if (window.confirm('Are you sure you want to remove this item?')) {
            const newDetails = [...data.details];
            newDetails[detailIndex].items = newDetails[detailIndex].items.filter((_, i) => i !== itemIndex);
            setData('details', newDetails);
        }
    };

    const updateDetail = (detailIndex: number, field: keyof PpmpDetail, value: string) => {
        const newDetails = [...data.details];
        if (field === 'general_description') {
            newDetails[detailIndex].general_description = value;
        }
        setData('details', newDetails);
    };

    const updateItem = (detailIndex: number, itemIndex: number, field: keyof PpmpItem, value: string | number) => {
        const newDetails = [...data.details];
        (newDetails[detailIndex].items[itemIndex][field] as any) = value;
        setData('details', newDetails);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(Ppmpstore().url, {
            onSuccess: () => toast.success('PPMP created successfully!'),
            onError: () => toast.error('Failed to create PPMP'),
        });
    };

    const computeGrandTotal = () => {
        return data.details.reduce((sum, d) => sum + d.items.reduce((s, i) => s + (Number(i.estimated_budget) || 0), 0), 0);
    };

    // Auto-update allocated budget when estimated budgets change
    React.useEffect(() => {
        const totalEstimated = computeGrandTotal();
        if (data.allocated_budget !== totalEstimated) {
            setData('allocated_budget', totalEstimated);
        }
    }, [data.details]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create PPMP" />
            <ToastContainer />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={ppmpIndex().url}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to PPMP List
                        </a>
                    </Button>
                </div>
                <Card>
                    <CardHeader className="animate-in fade-in slide-in-from-top duration-300">
                        <CardTitle>Create New PPMP Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                        >
                            {/* PPMP Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg animate-in fade-in duration-1000">
                                <div>
                                    <Label htmlFor="status_plan" className="mb-2">
                                        Status Plan
                                    </Label>
                                    <Select
                                        name="status_plan"
                                        value={data.status_plan}
                                        onValueChange={(value) => setData('status_plan', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="indicative">Indicative</SelectItem>
                                            <SelectItem value="final">Final</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status_plan} />
                                </div>

                                {/* Top-level Source of Funds removed - now collected per procurement item */}

                                <div>
                                    <Label htmlFor="allocated_budget" className="mb-2">
                                        Allocated Budget (Auto-calculated)
                                    </Label>
                                    <Input
                                        id="allocated_budget"
                                        type="number"
                                        name="allocated_budget"
                                        value={data.allocated_budget}
                                        readOnly
                                        disabled
                                        className="bg-gray-100 cursor-not-allowed"
                                        placeholder="Calculated from estimated budgets"
                                        min="0"
                                        step="0.01"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Automatically calculated from the sum of all estimated budgets
                                    </p>
                                    <InputError message={errors.allocated_budget} />
                                </div>

                                {/* <div>
                                    <Label htmlFor="status" className="mb-2">
                                        Status
                                    </Label>
                                    <Select
                                        name="status"
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="process">Process</SelectItem>
                                            <SelectItem value="utilized">Utilized</SelectItem>
                                            <SelectItem value="close">Close</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div> */}
                                <div>
                                    <Label htmlFor="approved_date" className="mb-2">
                                       PPMP Number
                                    </Label>
                                    <Input
                                            id="ppmp_no"
                                            name="ppmp_no"
                                            value={data.ppmp_no}
                                            readOnly
                                            disabled
                                        />
                                </div>



                                {/* Approved date removed per requirement; backend defaults to null */}
                            </div>

                            {/* Details Section */}
                            {data.details.map((detail, detailIndex) => (
                                <div
                                    key={detailIndex}
                                    className="border-2 rounded-xl p-6 animate-in slide-in-from-bottom duration-1000"
                                    style={{ animationDelay: `${detailIndex * 100}ms` }}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">
                                            Procurement Project Details
                                        </h3>
                                        {data.details.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeDetail(detailIndex)}
                                            >
                                                Remove Section
                                            </Button>
                                        )}
                                    </div>

                                    {/* General Description */}
                                    <div className="mb-6">
                                        <Label htmlFor={`details.${detailIndex}.general_description`} className="mb-2">
                                            General Description and Objective
                                        </Label>
                                        <Textarea
                                            id={`details.${detailIndex}.general_description`}
                                            name={`details[${detailIndex}][general_description]`}
                                            value={detail.general_description}
                                            onChange={(e) => updateDetail(detailIndex, 'general_description', e.target.value)}
                                            placeholder="Enter the general description of this procurement section"
                                            required
                                        />
                                        <InputError message={errors[`details.${detailIndex}.general_description` as keyof typeof errors]} />
                                    </div>

                                    {/* Items */}
                                    {detail.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="mb-4 border rounded-lg p-4 bg-accent animate-in fade-in slide-in-from-left duration-1000"
                                            style={{ animationDelay: `${itemIndex * 50}ms` }}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-semibold">
                                                    Procurement Fill up {itemIndex + 1}
                                                </span>
                                                {detail.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeItem(detailIndex, itemIndex)}
                                                    >
                                                        Remove Item
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <Label className="text-xs mb-2">Object of Expenditure</Label>
                                                    <Input
                                                        value={item.detail}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'detail', e.target.value)}
                                                        placeholder="Enter product details"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs mb-2">Type of Project</Label>
                                                    <Select
                                                        value={item.type_project}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'type_project', value)}
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Good">Goods</SelectItem>
                                                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                                            <SelectItem value="Consulting Service">Consulting Service</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Quantity/Size</Label>
                                                    <Input
                                                        value={item.qty_size}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'qty_size', e.target.value)}
                                                        placeholder="e.g., 10 units"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Recommended Mode</Label>
                                                    <Select
                                                        value={item.recommended}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'recommended', value)}
                                                        required

                                                    >
                                                        <SelectTrigger className="w-full text-sm truncate">
                                                            <SelectValue placeholder="Select mode" />
                                                        </SelectTrigger>
                                                        <SelectContent >
                                                            <SelectItem value="Direct Contracting">Direct Contracting</SelectItem>
                                                            <SelectItem value="Direct Acquisition">Direct Acquisition</SelectItem>
                                                            <SelectItem value="Competitive Bidding">Competitive Bidding</SelectItem>
                                                            <SelectItem value="Small Value Procurement">Negotiated Procurement - Small Value</SelectItem>
                                                            <SelectItem value="Emergency Cases Procurement">Negotiated Procurement - Emergency Cases</SelectItem>
                                                            <SelectItem value="Lease of Real Property and Venue">Negotiated Procurement - Lease of Real Property and Venue</SelectItem>
                                                            <SelectItem value="Direct Retail Purchase of Petroleum, Oil and Lubricant and Online Subscriptions">Negotiated Procurement Direct Retail Purchase of Petroleum, Oil and Lubricant and Online Subscriptions</SelectItem>
                                                            <SelectItem value="Scholarly or Artistic Work, Exclusive Technology and Media Service">Negotiated Procurement , Scholarly or Artistic Work, Exclusive Technology and Media Service</SelectItem>
                                                            <SelectItem value="Direct Procurement for Science, Technology, and Innovation">Direct Procurement for Science, Technology, and Innovation</SelectItem>
                                                            <SelectItem value="Purchase of Common-Use Supplies not available in the Procurement Service">Purchase of Common-Use Supplies not available in the Procurement Service</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Pre-Procurement Conference, if applicable</Label>
                                                    <Select
                                                        value={item.ppc}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'ppc', value)}
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Yes/No" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Yes">Yes</SelectItem>
                                                            <SelectItem value="No">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Start Activity</Label>
                                                    <Input
                                                        type="date"
                                                        value={item.start_activity}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'start_activity', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">End Activity</Label>
                                                    <Input
                                                        type="date"
                                                        value={item.end_activity}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'end_activity', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Expected Delivery (MM/YYYY - MM/YYYY)</Label>
                                                    <Input
                                                        value={item.expected_delivery}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'expected_delivery', e.target.value)}
                                                        placeholder="10/2025 - 12/2025"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Source of Funds</Label>
                                                    <Select
                                                        value={item.source_funds}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'source_funds', value)}
                                                        required
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Source of Fund" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="OTOP - One Town One Product">OTOP - One Town One Product</SelectItem>
                                                            <SelectItem value="GAD - Gender and Development">GAD - Gender and Development</SelectItem>
                                                            <SelectItem value="ICT - Information and Communications Technology">ICT - Information and Communications Technology</SelectItem>
                                                            <SelectItem value="MSME - Micro, Small and Medium Enterprises">MSME - Micro, Small and Medium Enterprises</SelectItem>
                                                            <SelectItem value="TRADE - Trade Development">TRADE - Trade Development</SelectItem>
                                                            <SelectItem value="INVESTMENT - Investment Promotion">INVESTMENT - Investment Promotion</SelectItem>
                                                            <SelectItem value="CONSUMER - Consumer Protection">CONSUMER - Consumer Protection</SelectItem>
                                                            <SelectItem value="ADMIN - Administrative">ADMIN - Administrative</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Estimated Budget</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.estimated_budget}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'estimated_budget', Number(e.target.value))}
                                                        required
                                                    />
                                                </div>

                                                {/* Per requirement, remove item total; grand total computed from estimated_budget */}

                                                <div>
                                                    <Label className="text-xs mb-2">Attached Support</Label>
                                                    <Input
                                                        value={item.attached_support}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'attached_support', e.target.value)}
                                                        placeholder="Document reference"
                                                        required
                                                    />
                                                </div>


                                                <div className="md:col-span-3">
                                                    <Label className="text-xs mb-2">Remarks</Label>
                                                    <Textarea
                                                        value={item.remarks}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'remarks', e.target.value)}
                                                        placeholder="Additional notes"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addItem(detailIndex)}
                                        className="mt-2"
                                    >
                                        Add Item to this Section
                                    </Button>
                                </div>
                            ))}

                            <div className="flex items-center gap-4 justify-end">
                                <div className="mr-auto text-sm text-muted-foreground">
                                    <div className="flex flex-col">
                                        <div>
                                            Grand Total:{' '}
                                            <span className="font-semibold">
                                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(computeGrandTotal())}
                                            </span>
                                        </div>
                                        <div className="text-xs">
                                            This automatically sets the Allocated Budget
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addDetail}
                                    disabled={processing}
                                >
                                    Add New Section
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create PPMP'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
