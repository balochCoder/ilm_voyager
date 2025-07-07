import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Link, Head, router } from '@inertiajs/react';
import { Edit, Eye, UserCheck, Check } from 'lucide-react';

import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { AssociateResource, BreadcrumbItem } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Props {
    associates: AssociateResource;
    associatesTotal: number,
    associatesActive: number,
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Associates',
        href: '/agents/associates',
    },
];

export default function AssociatesIndex({ associates, associatesTotal, associatesActive }: Props) {
    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Associates" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title="Associates" description="Manage your associates and their contact information" />
                    </div>
                    <Link href={route('agents:associates:create')} className="w-full sm:w-auto">
                        <Button variant="default" className="cursor-pointer w-full">
                            Add Associate
                        </Button>
                    </Link>
                </div>
                {/* Stats Cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                    <StatsCard
                        icon={<UserCheck className="h-4 w-4 text-blue-600" aria-label="Total associates icon" />}
                        label="Total Associates"
                        value={associatesTotal}
                        bgColor="bg-blue-100"
                        iconAriaLabel="Total associates icon"
                    />
                    <StatsCard
                        icon={<Check className="h-4 w-4 text-green-600" aria-label="Active associates icon" />}
                        label="Active Associates"
                        value={associatesActive}
                        bgColor="bg-green-100"
                        iconAriaLabel="Active associates icon"
                    />
                </div>
                <div className="space-y-4">
                    {associates.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <h3 className="text-lg font-semibold mb-2">No associates found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Get started by creating your first associate.
                                </p>
                                <Link href={route('agents:associates:create')}>
                                    <Button>Add Associate</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {associates.data.map((associate) => (
                                <Card key={associate.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 sm:p-6">
                                        {/* Header */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-sm">{associate.associate_name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Added {format(new Date(associate.created_at), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <StatusSwitch
                                                id={associate.id}
                                                checked={associate.is_active}
                                                route={route('agents:associates:toggle-status', { associate: associate.id })}
                                            />
                                        </div>
                                        {/* Contact Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="font-medium">Contact:</span>
                                                <span>{associate.contact_person}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="font-medium">Email:</span>
                                                <span className="text-muted-foreground">{associate.contact_email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="font-medium">Mobile:</span>
                                                <span className="text-muted-foreground">{associate.contact_mobile}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span className="font-medium">Category:</span>
                                                <span className="capitalize">{associate.category}</span>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link href={route('agents:associates:edit', { associate: associate.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={route('agents:associates:show', { associate: associate.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Show
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                {/* Pagination if meta present */}
                {associates.meta && associates.meta.last_page > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    disabled={associates.meta.current_page === 1}
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(associates.meta.current_page - 1)}
                                />
                            </PaginationItem>
                            {Array.from({ length: associates.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    {typeof page === 'string' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            className="cursor-pointer"
                                            size="default"
                                            onClick={() => handlePageChange(page)}
                                            isActive={page === associates.meta.current_page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    disabled={associates.meta.current_page === associates.meta.last_page}
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(associates.meta.current_page + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
}
