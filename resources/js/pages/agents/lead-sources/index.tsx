import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LeadSource {
    id: string;
    name: string;
    is_active: boolean;
    deleted_at: string | null;
    creator?: { name?: string } | null;
    created_at?: string;
    updated_at?: string;
}
interface LeadSourceResource {
    data: LeadSource[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}
interface Props {
    leadSources: LeadSourceResource;
}

function formatDate(date?: string | null) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function LeadSourcesIndex({ leadSources }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [keyword, setKeyword] = useState('');
    const [orderBy, setOrderBy] = useState('');

    function handleSearch() {
        const url = new URL(window.location.href);
        if (keyword) url.searchParams.set('keyword', keyword);
        else url.searchParams.delete('keyword');
        if (orderBy) url.searchParams.set('orderBy', orderBy);
        else url.searchParams.delete('orderBy');
        url.searchParams.delete('page');
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    }

    function handleReset() {
        setKeyword('');
        setOrderBy('');
        const url = new URL(window.location.href);
        url.searchParams.delete('keyword');
        url.searchParams.delete('orderBy');
        url.searchParams.delete('page');
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    }

    const isFilterActive = keyword !== '' || orderBy !== '';

    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    useEffect(() => {
        if (flash?.success) {
            // Show success message
            toast.success(flash?.success);
        }
    }, [flash]);
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/agents/dashboard' },
                { title: 'Lead Sources', href: '/agents/lead-sources' },
            ]}
        >
            <Head title="Lead Sources" />
            <div className="flex w-full flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="Lead Sources" description="Browse and manage all lead sources" />
                    <Link href={route('agents:lead-sources:create')}>
                        <Button variant="default">Add Lead Source</Button>
                    </Link>
                </div>
                {/* Search and Order Controls */}
                <div className="mb-2 flex w-full flex-row items-end gap-2">
                    <div className="min-w-[200px] flex-1">
                        <Input
                            type="text"
                            placeholder="Search by keyword..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                    </div>
                    <div className="min-w-[200px] flex-1">
                        <Select value={orderBy} onValueChange={setOrderBy}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Order By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at">Added On</SelectItem>
                                <SelectItem value="updated_at">Last Updated</SelectItem>
                                <SelectItem value="is_active">Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="default" onClick={handleSearch} disabled={!isFilterActive}>
                        Search
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={!isFilterActive}>
                        Reset
                    </Button>
                </div>
                <Card className="shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="max-w-[400px] min-w-[300px]">Lead Source</TableHead>
                                    <TableHead>Added By</TableHead>
                                    <TableHead>Added On</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leadSources.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="text-lg font-semibold">No lead sources found</span>
                                                <span className="text-sm">Get started by adding a new lead source.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leadSources.data.map((ls) => (
                                        <TableRow key={ls.id} className={ls.deleted_at ? 'bg-red-50' : ''}>
                                            <TableCell className="max-w-[400px] min-w-[300px] overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                                                {ls.name}
                                            </TableCell>
                                            <TableCell>{ls.creator?.name || '-'}</TableCell>
                                            <TableCell>{formatDate(ls.created_at)}</TableCell>
                                            <TableCell>{formatDate(ls.updated_at)}</TableCell>
                                            <TableCell>
                                                <StatusSwitch
                                                    id={ls.id}
                                                    checked={ls.is_active}
                                                    route={route('agents:lead-sources:toggle-status', { leadSource: ls.id })}
                                                    showLabel={false}
                                                />
                                            </TableCell>
                                            <TableCell className="space-x-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('agents:lead-sources:edit', { leadSource: ls.id })}>
                                                                <Button size="icon" variant="ghost" className="p-2">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {ls.deleted_at && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => router.post(route('agents:lead-sources:restore', { id: ls.id }))}
                                                    >
                                                        Restore
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {/* Pagination */}
                {leadSources.meta.last_page > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(leadSources.meta.current_page - 1)}
                                    disabled={leadSources.meta.current_page === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: leadSources.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink isActive={page === leadSources.meta.current_page} onClick={() => handlePageChange(page)}>
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(leadSources.meta.current_page + 1)}
                                    disabled={leadSources.meta.current_page === leadSources.meta.last_page}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
}
