import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { CounsellorResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Edit, Users, Check, Target, MessageSquare, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  counsellors: CounsellorResource;
  counsellorsTotal: number;
  counsellorsActive: number;
  branches?: { id: string; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Counsellors', href: '/agents/counsellors' },
];

export default function CounsellorsIndex({ counsellors, counsellorsTotal, counsellorsActive }: Props) {
    const {flash} = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Counsellors" />
            <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Counsellors" description="Manage your counsellors and their contact information" />
                    </div>
                    <Link href={route('agents:counsellors:create')} className="w-full sm:w-auto">
                        <Button className="w-full cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Counsellor
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatsCard
                        icon={<Users className="h-4 w-4 text-blue-600" aria-label="Total counsellors icon" />}
                        label="Total Counsellors"
                        value={counsellorsTotal}
                        bgColor="bg-blue-100"
                        iconAriaLabel="Total counsellors icon"
                    />
                    <StatsCard
                        icon={<Check className="h-4 w-4 text-green-600" aria-label="Active counsellors icon" />}
                        label="Active"
                        value={counsellorsActive}
                        bgColor="bg-green-100"
                        iconAriaLabel="Active counsellors icon"
                    />
                </div>

                {/* Counsellors Grid */}
                {counsellors.data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {counsellors.data.map((counsellor) => (
                            <Card key={counsellor.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    {/* Counsellor Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Users className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{counsellor.user.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Added {format(new Date(counsellor.created_at), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusSwitch
                                            id={counsellor.id}
                                            checked={counsellor.is_active}
                                            route={route('agents:counsellors:toggle-status', { counsellor: counsellor.id })}
                                        />
                                    </div>

                                    {/* Essential Information */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="font-medium truncate max-w-[120px]" title={counsellor.user.email}>
                                                {counsellor.user.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Branch:</span>
                                            <span className="font-medium">{counsellor.branch.name}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-3 border-t space-y-2">
                                        {/* Primary Actions */}
                                        <div className="flex justify-between items-center">
                                            <Link href={route('agents:counsellors:edit', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={route('agents:counsellors:assign-institutions', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Building2 className="h-3 w-3 mr-1" />
                                                    Assign Institutions
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Secondary Actions */}
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="flex-1">
                                                <Target className="h-3 w-3 mr-1" />
                                                Add Target
                                            </Button>
                                            <Button size="sm" variant="ghost" className="flex-1">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Add Remarks
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {counsellors.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                                <Users className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No counsellors found</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first counsellor</p>
                            <Link href={route('agents:counsellors:create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Counsellor
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
