import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index as sourceIndex, create as sourceCreate, store as sourceStore } from '@/routes/source-of-funds';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React from 'react';

const DIVISIONS = [
    { value: 'AFMD', label: 'AFMD' },
    { value: 'MSSD', label: 'MSSD' },
    { value: 'CPD', label: 'CPD' },
    { value: 'IDD', label: 'IDD' },
    { value: 'SDD', label: 'SDD' },
    { value: 'RAPID', label: 'RAPID' },
]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Source of Funds',
        href: sourceIndex().url,
    },
    {
        title: 'Create Source',
        href: sourceCreate().url,
    },
];

export default function Create({ divisions }: any) {
    const { data, setData, post, processing, errors } = useForm({
        division: '',
        name: '',
        description: '',
    });

    React.useEffect(() => {
        if ((window as any).props?.flash?.success) {
            toast.success((window as any).props.flash.success)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(sourceStore().url, {
            onSuccess: () => toast.success('Source created'),
            onError: () => toast.error('Failed to create'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Source of Fund" />
            <ToastContainer />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={sourceIndex().url}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to list
                        </a>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Create Source of Fund</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Division</Label>
                                <Select value={data.division} onValueChange={value => setData('division', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIVISIONS.map((division) => (
                                            <SelectItem key={division.value} value={division.value}>
                                                {division.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.division} />
                            </div>

                            <div>
                                <Label>Name</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea value={data.description} onChange={e => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
