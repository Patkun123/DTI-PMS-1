import { Head, useForm } from '@inertiajs/react';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    division: string | null;
    requester: string | null;
}

interface EditUserProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

interface UserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    division: string;
    requester: string;
}

export default function EditUser({ user }: EditUserProps) {
    const { data, setData, put, processing, errors } = useForm<UserFormData>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        division: user.division || '',
        requester: user.requester || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            onSuccess: () => toast.success('User updated successfully!'),
            onError: () => toast.error('Failed to update user'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <ToastContainer />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/admin/users">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </a>
                    </Button>
                </div>
                <Card>
                    <CardHeader className="animate-in fade-in slide-in-from-top duration-300">
                        <CardTitle>Edit User: {user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" className="mb-2">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="mb-2">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email address"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="mb-2">
                                        New Password (leave blank to keep current)
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation" className="mb-2">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div>
                                    <Label htmlFor="role" className="mb-2">
                                        Role
                                    </Label>
                                    <Select
                                        name="role"
                                        value={data.role}
                                        onValueChange={(value) => setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div>
                                    <Label htmlFor="division" className="mb-2">
                                        Division
                                    </Label>
                                    <Input
                                        id="division"
                                        name="division"
                                        value={data.division}
                                        onChange={(e) => setData('division', e.target.value)}
                                        placeholder="Enter division"
                                    />
                                    <InputError message={errors.division} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="requester" className="mb-2">
                                        Chief/Requester
                                    </Label>
                                    <Input
                                        id="requester"
                                        name="requester"
                                        value={data.requester}
                                        onChange={(e) => setData('requester', e.target.value)}
                                        placeholder="Enter chief/requester name"
                                    />
                                    <InputError message={errors.requester} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
