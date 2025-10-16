import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, User, Shield, Building, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    division: string | null;
    requester: string | null;
    created_at: string;
    updated_at: string;
}

interface ShowUserProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

export default function ShowUser({ user }: ShowUserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/admin/users">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">{user.name}</CardTitle>
                                        <p className="text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Role:</span>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </div>
                                    {user.division && (
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Division:</span>
                                            <span className="text-sm">{user.division}</span>
                                        </div>
                                    )}
                                    {user.requester && (
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Chief:</span>
                                            <span className="text-sm">{user.requester}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* User Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                            <p className="text-sm">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                            <p className="text-sm flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Role</label>
                                            <div className="mt-1">
                                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Division</label>
                                            <p className="text-sm">{user.division || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Chief/Requester</label>
                                            <p className="text-sm">{user.requester || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                                            <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <Button asChild>
                                <Link href={`/admin/users/${user.id}/edit`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit User
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/users">
                                    Back to Users
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
