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

// Lightweight debounce helper
function debounceFn<Func extends (...args: any[]) => any>(fn: Func, wait = 300) {
    let t: ReturnType<typeof setTimeout> | null = null;
    const debounced = (...args: Parameters<Func>) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
    debounced.cancel = () => {
        if (t) {
            clearTimeout(t);
            t = null;
        }
    };
    return debounced as Func & { cancel: () => void };
}

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
    source_funds: number;
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

interface FormErrors {
    [key: string]: string | undefined;
}

interface SourceOption {
    id: number;
    name: string;
    division?: string;
}

// Helper function to check if date is valid
const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

export default function Create({ proposed_ppmp_no, user_division }: any) {
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
                source_funds: 0,
                estimated_budget: 0,
                attached_support: '',
                remarks: '',
            }],
        }],
    });

    // Track previous total to prevent infinite re-render
    const prevTotalRef = React.useRef<number>(0);
    const isUpdatingBudgetRef = React.useRef<boolean>(false);

    // Source of funds state
    const [sourceOptions, setSourceOptions] = React.useState<SourceOption[]>([]);
    const [sourceLoading, setSourceLoading] = React.useState(false);

    // Fetch source options
    const fetchSourceOptions = React.useCallback(async (q: string) => {
        try {
            setSourceLoading(true);
            const params = new URLSearchParams();
            if (q) params.append('q', q);
            if (user_division) params.append('division', user_division);
            params.append('per_page', '50');

            const res = await fetch(`/source-of-funds?${params.toString()}`, {
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const json = await res.json();
            const data = json?.data ?? json?.source_of_funds?.data ?? json;
            const items = Array.isArray(data) ? data : (data?.data ?? []);

            const mapped: SourceOption[] = items.map((it: any) => ({
                id: it.id,
                name: it.name ?? it.title ?? it.description ?? 'Unnamed',
                division: it.division
            }));

            setSourceOptions(mapped);
        } catch (e) {
            console.error('Failed to load source of funds', e);
            toast.error('Failed to load source of funds');
        } finally {
            setSourceLoading(false);
        }
    }, [user_division]);

    // Memoized debounced fetch
    const debouncedFetchSource = React.useMemo(
        () => debounceFn(fetchSourceOptions, 300),
        [fetchSourceOptions]
    );

    // Cleanup debounce on unmount
    React.useEffect(() => {
        return () => {
            debouncedFetchSource.cancel();
        };
    }, [debouncedFetchSource]);

    // Initial fetch
    React.useEffect(() => {
        fetchSourceOptions('');
    }, [fetchSourceOptions]);

    // Compute grand total - memoized for performance
    const grandTotal = React.useMemo(() => {
        return data.details.reduce((sum, d) =>
            sum + d.items.reduce((s, i) =>
                s + (Number(i.estimated_budget) || 0), 0
            ), 0
        );
    }, [data.details]);

    // Auto-update allocated budget when grand total changes
    React.useEffect(() => {
        if (isUpdatingBudgetRef.current) return;

        if (prevTotalRef.current !== grandTotal) {
            prevTotalRef.current = grandTotal;
            isUpdatingBudgetRef.current = true;

            setData((prev) => ({
                ...prev,
                allocated_budget: grandTotal
            }));

            // Reset flag after state update
            setTimeout(() => {
                isUpdatingBudgetRef.current = false;
            }, 0);
        }
    }, [grandTotal]); // Only depend on grandTotal, not setData

    const addDetail = () => {
        setData((prev) => ({
            ...prev,
            details: [
                ...prev.details,
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
                        source_funds: 0,
                        estimated_budget: 0,
                        attached_support: '',
                        remarks: '',
                    }],
                },
            ],
        }));
    };

    const removeDetail = (detailIndex: number) => {
        if (data.details.length === 1) {
            toast.error('Cannot remove the last section');
            return;
        }
        if (window.confirm('Are you sure you want to remove this section?')) {
            setData((prev) => ({
                ...prev,
                details: prev.details.filter((_, i) => i !== detailIndex),
            }));
        }
    };

    const addItem = (detailIndex: number) => {
        setData((prev) => {
            const newDetails = [...prev.details];
            newDetails[detailIndex] = {
                ...newDetails[detailIndex],
                items: [
                    ...newDetails[detailIndex].items,
                    {
                        detail: '',
                        type_project: '',
                        qty_size: '',
                        recommended: '',
                        ppc: '',
                        start_activity: '',
                        end_activity: '',
                        expected_delivery: '',
                        source_funds: 0,
                        estimated_budget: 0,
                        attached_support: '',
                        remarks: '',
                    },
                ],
            };
            return { ...prev, details: newDetails };
        });
    };

    const removeItem = (detailIndex: number, itemIndex: number) => {
        if (data.details[detailIndex].items.length === 1) {
            toast.error('Cannot remove the last item in a section');
            return;
        }
        if (window.confirm('Are you sure you want to remove this item?')) {
            setData((prev) => {
                const newDetails = [...prev.details];
                newDetails[detailIndex] = {
                    ...newDetails[detailIndex],
                    items: newDetails[detailIndex].items.filter((_, i) => i !== itemIndex),
                };
                return { ...prev, details: newDetails };
            });
        }
    };

    const updateDetail = (detailIndex: number, field: keyof PpmpDetail, value: string) => {
        setData((prev) => {
            const newDetails = [...prev.details];
            if (field === 'general_description') {
                newDetails[detailIndex] = {
                    ...newDetails[detailIndex],
                    general_description: value
                };
            }
            return { ...prev, details: newDetails };
        });
    };

    const updateItem = (
        detailIndex: number,
        itemIndex: number,
        field: keyof PpmpItem,
        value: string | number
    ) => {
        setData((prev) => {
            const newDetails = [...prev.details];
            const items = [...newDetails[detailIndex].items];
            const currentItem = items[itemIndex];

            // Date validation with proper date parsing
            if (field === 'end_activity' && currentItem.start_activity) {
                const startDate = new Date(currentItem.start_activity);
                const endDate = new Date(value as string);

                if (isValidDate(currentItem.start_activity) &&
                    isValidDate(value as string) &&
                    endDate < startDate) {
                    toast.error('End date cannot be before start date');
                    return prev;
                }
            }

            if (field === 'start_activity' && currentItem.end_activity) {
                const startDate = new Date(value as string);
                const endDate = new Date(currentItem.end_activity);

                if (isValidDate(value as string) &&
                    isValidDate(currentItem.end_activity) &&
                    startDate > endDate) {
                    toast.error('Start date cannot be after end date');
                    return prev;
                }
            }

            // Budget validation
            if (field === 'estimated_budget' && Number(value) < 0) {
                toast.error('Budget cannot be negative');
                return prev;
            }

            items[itemIndex] = { ...items[itemIndex], [field]: value };
            newDetails[detailIndex] = { ...newDetails[detailIndex], items };
            return { ...prev, details: newDetails };
        });
    };

    // Comprehensive form validation
    const validateForm = (): boolean => {
        // Check if there are details
        if (data.details.length === 0) {
            toast.error('At least one detail section is required');
            return false;
        }

        // Validate each section
        for (let i = 0; i < data.details.length; i++) {
            const detail = data.details[i];

            // Check general description
            if (!detail.general_description.trim()) {
                toast.error(`Section ${i + 1} must have a general description`);
                return false;
            }

            // Check if section has items
            if (detail.items.length === 0) {
                toast.error(`Section ${i + 1} must have at least one item`);
                return false;
            }

            // Validate each item
            for (let j = 0; j < detail.items.length; j++) {
                const item = detail.items[j];
                const itemLabel = `Section ${i + 1}, Item ${j + 1}`;

                if (!item.detail.trim()) {
                    toast.error(`${itemLabel}: Object of Expenditure is required`);
                    return false;
                }

                if (!item.type_project) {
                    toast.error(`${itemLabel}: Type of Project is required`);
                    return false;
                }

                if (!item.qty_size.trim()) {
                    toast.error(`${itemLabel}: Quantity/Size is required`);
                    return false;
                }

                if (!item.recommended) {
                    toast.error(`${itemLabel}: Recommended Mode is required`);
                    return false;
                }

                if (!item.start_activity) {
                    toast.error(`${itemLabel}: Start Activity date is required`);
                    return false;
                }

                if (!item.end_activity) {
                    toast.error(`${itemLabel}: End Activity date is required`);
                    return false;
                }

                if (!item.expected_delivery.trim()) {
                    toast.error(`${itemLabel}: Expected Delivery is required`);
                    return false;
                }

                if (!item.source_funds || item.source_funds === 0) {
                    toast.error(`${itemLabel}: Source of Funds is required`);
                    return false;
                }

                if (!item.estimated_budget || item.estimated_budget <= 0) {
                    toast.error(`${itemLabel}: Estimated Budget must be greater than 0`);
                    return false;
                }

                if (!item.attached_support.trim()) {
                    toast.error(`${itemLabel}: Attached Support is required`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        post(Ppmpstore().url, {
            onSuccess: () => toast.success('PPMP created successfully!'),
            onError: () => toast.error('Failed to create PPMP. Please check the form for errors.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create PPMP" />
            <ToastContainer position="top-right" autoClose={3000} />
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
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* PPMP Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg animate-in fade-in duration-1000">
                                <div>
                                    <Label htmlFor="status_plan" className="mb-2">
                                        Status Plan
                                    </Label>
                                    <Select
                                        name="status_plan"
                                        value={data.status_plan}
                                        onValueChange={(value) => setData((prev) => ({ ...prev, status_plan: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="indicative">Indicative</SelectItem>
                                            <SelectItem value="final">Final</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={(errors as FormErrors).status_plan} />
                                </div>

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
                                    <InputError message={(errors as FormErrors).allocated_budget} />
                                </div>

                                <div>
                                    <Label htmlFor="ppmp_no" className="mb-2">
                                        PPMP Number
                                    </Label>
                                    <Input
                                        id="ppmp_no"
                                        name="ppmp_no"
                                        value={data.ppmp_no}
                                        readOnly
                                        disabled
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
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
                                            Procurement Project Details #{detailIndex + 1}
                                        </h3>
                                        {data.details.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeDetail(detailIndex)}
                                                aria-label={`Remove section ${detailIndex + 1}`}
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
                                        <InputError message={(errors as FormErrors)[`details.${detailIndex}.general_description`]} />
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
                                                    Procurement Item {itemIndex + 1}
                                                </span>
                                                {detail.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeItem(detailIndex, itemIndex)}
                                                        aria-label={`Remove item ${itemIndex + 1}`}
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

                                                <div className="md:col-span-2">
                                                    <Label className="text-xs mb-2">Recommended Mode</Label>
                                                    <Select
                                                        value={item.recommended}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'recommended', value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select mode" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Direct Contracting">Direct Contracting</SelectItem>
                                                            <SelectItem value="Direct Acquisition">Direct Acquisition</SelectItem>
                                                            <SelectItem value="Competitive Bidding">Competitive Bidding</SelectItem>
                                                            <SelectItem value="Small Value Procurement">Negotiated Procurement - Small Value</SelectItem>
                                                            <SelectItem value="Emergency Cases Procurement">Negotiated Procurement - Emergency Cases</SelectItem>
                                                            <SelectItem value="Lease of Real Property and Venue">Negotiated Procurement - Lease of Real Property and Venue</SelectItem>
                                                            <SelectItem value="Direct Retail Purchase of Petroleum, Oil and Lubricant and Online Subscriptions">Negotiated Procurement - Direct Retail Purchase of POL & Subscriptions</SelectItem>
                                                            <SelectItem value="Scholarly or Artistic Work, Exclusive Technology and Media Service">Negotiated Procurement - Scholarly/Artistic Work</SelectItem>
                                                            <SelectItem value="Direct Procurement for Science, Technology, and Innovation">Direct Procurement - Science & Technology</SelectItem>
                                                            <SelectItem value="Purchase of Common-Use Supplies not available in the Procurement Service">Purchase of Common-Use Supplies (Not in PS)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Pre-Procurement Conference</Label>
                                                    <Select
                                                        value={item.ppc}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'ppc', value)}
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
                                                        min={item.start_activity || undefined}
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

                                                <div className="md:col-span-2">
                                                    <Label className="text-xs mb-2">Source of Funds ({user_division})</Label>
                                                    <Select
                                                        value={String(item.source_funds || '')}
                                                        onValueChange={(value) => updateItem(detailIndex, itemIndex, 'source_funds', Number(value))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={sourceLoading ? 'Loading...' : 'Select source of funds'} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sourceLoading && (
                                                                <SelectItem value="0" disabled>Loading...</SelectItem>
                                                            )}
                                                            {!sourceLoading && sourceOptions.length === 0 && (
                                                                <SelectItem value="0" disabled>No sources found for {user_division}</SelectItem>
                                                            )}
                                                            {!sourceLoading && sourceOptions.map((opt) => (
                                                                <SelectItem key={opt.id} value={String(opt.id)}>
                                                                    {opt.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div>
                                                    <Label className="text-xs mb-2">Estimated Budget</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.estimated_budget}
                                                        onChange={(e) => updateItem(detailIndex, itemIndex, 'estimated_budget', Number(e.target.value))}
                                                        required
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
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
                                                        rows={2}
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
                                        aria-label={`Add item to section ${detailIndex + 1}`}
                                    >
                                        + Add Item to this Section
                                    </Button>
                                </div>
                            ))}

                            <div className="flex items-center gap-4 justify-end flex-wrap">
                                <div className="mr-auto text-sm">
                                    <div className="font-medium">
                                        Grand Total:{' '}
                                        <span className="text-lg font-bold text-primary">
                                            {new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP'
                                            }).format(grandTotal)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        This automatically sets the Allocated Budget
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addDetail}
                                    disabled={processing}
                                    aria-label="Add new section"
                                >
                                    + Add New Section
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
