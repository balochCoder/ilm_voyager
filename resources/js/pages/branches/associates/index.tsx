import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Edit, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import StatsCard from '@/components/stats-card';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AssociateResource, BreadcrumbItem, SharedData } from '@/types';

interface Props {
    associates: AssociateResource;
    associatesTotal: number;
    associatesActive: number;
}

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/branch-office/dashboard' },
    { title: 'Associates', href: '/branch-office/associates' },
];

export default function BranchAssociatesIndex({ associates, associatesTotal, associatesActive }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [keyword, setKeyword] = useState('');
    const [email, setEmail] = useState('');
    const [statusValue, setStatusValue] = useState('all');
    const [statusOpen, setStatusOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialFilters, setInitialFilters] = useState({ status: 'all', keyword: '', email: '' });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // TODO: Add filter/search/reset logic

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Associates" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Associates" description="Manage your branch's associates and their contact information" />
                    </div>
                    <Link href={route('branches:associates:create')} className="w-full sm:w-auto">
                        <Button variant="default" className="w-full cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Associate
                        </Button>
                    </Link>
                </div>
                {/* TODO: Filters Row */}
                {/* Stats Cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatsCard
                        icon={<Plus className="h-4 w-4 text-blue-600" aria-label="Total associates icon" />}
                        label="Total Associates"
                        value={associatesTotal}
                        bgColor="bg-blue-100"
                        iconAriaLabel="Total associates icon"
                    />
                    <StatsCard
                        icon={<Check className="h-4 w-4 text-green-600" aria-label="Active associates icon" />}
                        label="Active"
                        value={associatesActive}
                        bgColor="bg-green-100"
                        iconAriaLabel="Active associates icon"
                    />
                </div>
                {/* Associates Grid */}
                {associates.data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {associates.data.map((associate) => (
                            <Card key={associate.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    {/* Associate Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Plus className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{associate.user.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Added {associate.created_at}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusSwitch
                                            id={associate.id}
                                            checked={associate.is_active}
                                            route={route('branches:associates:toggle-status', { associate: associate.id })}
                                        />
                                    </div>
                                    {/* Essential Information */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="font-medium truncate max-w-[120px]" title={associate.user.email}>
                                                {associate.user.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Category:</span>
                                            <span className="font-medium">{associate.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Country:</span>
                                            <span className="font-medium">{associate.country?.name}</span>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="mt-4 pt-3 border-t space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Link href={route('branches:associates:edit', { associate: associate.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {/* Empty State */}
                {associates.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                                <Plus className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No associates found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Get started by adding your first associate.
                            </p>
                            <Link href={route('branches:associates:create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Associate
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
                {/* Pagination Controls */}
                {associates.meta && associates.meta.last_page > 1 && (
                    <div className="overflow-x-auto">
                        <Pagination className="mt-4 sm:mt-8 min-w-[400px]">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        className="cursor-pointer"
                                        size="default"
                                        onClick={() => {}}
                                        disabled={associates.meta.current_page === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: associates.meta.last_page }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            className="cursor-pointer"
                                            size="default"
                                            onClick={() => {}}
                                            isActive={page === associates.meta.current_page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        className="cursor-pointer"
                                        size="default"
                                        onClick={() => {}}
                                        disabled={associates.meta.current_page === associates.meta.last_page}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 