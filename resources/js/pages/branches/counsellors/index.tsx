import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { CounsellorResource, BreadcrumbItem, SharedData, CounsellorRemark } from '@/types';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Users, Check, Target, MessageSquare, Search, RotateCcw, ChevronsUpDown, CalendarIcon, Pencil, User, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2 } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import axios from 'axios';

interface Props {
  counsellors: CounsellorResource;
  counsellorsTotal: number;
  counsellorsActive: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/branch-office/dashboard' },
  { title: 'Counsellors', href: '/branch-office/counsellors' },
];

const DEFAULT_FILTERS = {
    status: 'all',
    keyword: '',
    email: '',
    download_csv: 'all',
};
type FilterState = typeof DEFAULT_FILTERS;

export default function BranchCounsellorsIndex({ counsellors, counsellorsTotal = 0, counsellorsActive = 0 }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCounsellor, setSelectedCounsellor] = useState<CounsellorResource['data'][0] | null>(null);
    const [remarks, setRemarks] = useState<CounsellorRemark[]>([]);
    const [isRemarksSheetOpen, setIsRemarksSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRemark, setEditingRemark] = useState<CounsellorRemark | null>(null);
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [initialFilters, setInitialFilters] = useState(DEFAULT_FILTERS);
    const [error, setError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, put } = useForm({
        remark: '',
        remark_date: format(new Date(), 'yyyy-MM-dd'),
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    useEffect(() => {
        // Parse query params and set filters/initialFilters on mount
        const params = new URLSearchParams(window.location.search);
        const filter: FilterState = { ...DEFAULT_FILTERS };
        Object.keys(DEFAULT_FILTERS).forEach((key) => {
            const value = params.get(`filter[${key}]`);
            if (value !== null) filter[key as keyof FilterState] = value;
        });
        setFilters(filter);
        setInitialFilters(filter);
    }, []);

    // Filter update helper
    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Search handler
    const handleSearch = () => {
        setError(null);
        const url = new URL(window.location.href);
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== 'all' && value !== '') url.searchParams.set(`filter[${key}]`, value);
            else url.searchParams.delete(`filter[${key}]`);
        });
        url.searchParams.delete('page');
        setIsLoading(true);
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
                setError('Failed to fetch results. Please try again.');
            },
        });
    };

    // Reset handler
    const handleReset = () => {
        setFilters(initialFilters);
        setIsLoading(true);
        setError(null);
        const url = new URL(window.location.href);
        Object.keys(DEFAULT_FILTERS).forEach((key) => {
            url.searchParams.delete(`filter[${key}]`);
        });
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
                setError('Failed to reset filters. Please try again.');
            },
        });
    };

    const getSelectedStatusName = () => {
        if (filters.status === 'all') return 'All Status';
        return filters.status === 'active' ? 'Active' : 'Inactive';
    };
    const hasFilterChanges = () => {
        return Object.keys(DEFAULT_FILTERS).some(
            (key) => filters[key as keyof FilterState] !== initialFilters[key as keyof FilterState]
        );
    };
    const hasActiveFilters = () => {
        return Object.entries(filters).some(([key, value]) => value !== DEFAULT_FILTERS[key as keyof FilterState]);
    };

    // Remarks logic (full-featured for branch)
    const fetchRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        if (!counsellor) return;
        try {
            const response = await axios.get(`/branch-office/counsellors/${counsellor.id}/remarks`);
            setRemarks(response.data.data || []);
        } catch (error) {
            setRemarks([]);
        }
    };

    const handleOpenRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        setSelectedCounsellor(counsellor);
        setIsRemarksSheetOpen(true);
        setData('remark', '');
        setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
        setIsEditing(false);
        setEditingRemark(null);
        await fetchRemarks(counsellor);
    };

    const handleSubmitRemark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor) return;
        try {
            await axios.post(`/branch-office/counsellors/${selectedCounsellor.id}/remarks`, data);
            await fetchRemarks(selectedCounsellor);
            setData('remark', '');
            setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
        } catch (error) {}
    };

    const handleEditRemark = (remark: any) => {
        setEditingRemark(remark);
        setIsEditing(true);
        setData('remark', remark.remark);
        setData('remark_date', remark.remark_date);
    };

    const handleUpdateRemark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor || !editingRemark) return;
        try {
            await axios.put(`/branch-office/counsellors/${selectedCounsellor.id}/remarks/${editingRemark.id}`, data);
            await fetchRemarks(selectedCounsellor);
            setIsEditing(false);
            setEditingRemark(null);
            setData('remark', '');
            setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
        } catch (error) {}
    };

    const handleCancelEdit = () => {
        setEditingRemark(null);
        setIsEditing(false);
        setData('remark', '');
        setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
    };

    // Pagination handler
    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    // Input handler for remark form
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Counsellors" />
            <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Counsellors" description="Manage your branch's counsellors and their contact information" />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link href={route('branches:counsellors:create')} className="w-full sm:w-auto">
                            <Button className="w-full cursor-pointer">
                                <Plus className="h-4 w-4" />
                                Add Counsellor
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-2 p-2 bg-red-100 text-red-700 rounded border border-red-300">
                        {error}
                    </div>
                )}

                {/* Filters Row */}
                <div className="flex flex-row flex-wrap gap-4 w-full mb-2">
                    {/* Status Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="status-filter" className="text-sm font-medium">
                            Filter by Status
                        </Label>
                        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={statusOpen}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <span className="truncate">{getSelectedStatusName()}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[160px]">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            <CommandItem value="all" onSelect={() => updateFilter('status', 'all')}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.status === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                All Status
                                            </CommandItem>
                                            <CommandItem value="active" onSelect={() => updateFilter('status', 'active')}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.status === 'active' ? 'opacity-100' : 'opacity-0')} />
                                                Active
                                            </CommandItem>
                                            <CommandItem value="inactive" onSelect={() => updateFilter('status', 'inactive')}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.status === 'inactive' ? 'opacity-100' : 'opacity-0')} />
                                                Inactive
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Keyword Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="keyword" className="text-sm font-medium">
                            Keyword
                        </Label>
                        <Input
                            id="keyword"
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => updateFilter('keyword', e.target.value)}
                            placeholder="Search counsellors..."
                        />
                    </div>
                    {/* Email Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="text"
                            value={filters.email}
                            onChange={(e) => updateFilter('email', e.target.value)}
                            placeholder="Search by email..."
                        />
                    </div>
                    {/* Download CSV Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="download_csv" className="text-sm font-medium">
                            Download CSV
                        </Label>
                        <select
                            id="download_csv"
                            className="w-full border rounded px-2 py-2 text-sm"
                            value={filters.download_csv}
                            onChange={(e) => updateFilter('download_csv', e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="all">All</option>
                            <option value="allowed">Allowed</option>
                            <option value="allowed_without_contact">Allowed Without Contact</option>
                            <option value="not_allowed">Not Allowed</option>
                        </select>
                    </div>
                    {/* Search/Reset Buttons */}
                    <div className="flex flex-1 flex-row gap-2 flex-nowrap items-end min-w-[180px]">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleSearch}
                            disabled={isLoading || !hasFilterChanges()}
                            className="flex-1"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading || !hasActiveFilters()}
                            className="min-w-[100px]"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

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
                                            route={route('branches:counsellors:toggle-status', { counsellor: counsellor.id })}
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
                                            <span className="text-muted-foreground">Last Login:</span>
                                            <span className="font-medium">
                                                {counsellor.user.last_login_at
                                                    ? format(new Date(counsellor.user.last_login_at), 'MMM dd, yyyy HH:mm')
                                                    : 'Never'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-3 border-t space-y-2">
                                        {/* Primary Actions */}
                                        <div className="flex justify-between items-center">
                                            <Link href={route('branches:counsellors:edit', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={route('branches:counsellors:assign-institutions', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Building2 className="h-3 w-3 mr-1" />
                                                    Assign Institutions
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Secondary Actions */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1"
                                                onClick={() => handleOpenRemarks(counsellor)}
                                            >
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
                            <p className="text-muted-foreground text-center mb-4">
                                {hasActiveFilters()
                                    ? 'Try adjusting your filters to see more results.'
                                    : 'Get started by adding your first counsellor.'}
                            </p>
                            {!hasActiveFilters() && (
                                <Link href={route('branches:counsellors:create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add First Counsellor
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination Controls */}
                {counsellors.meta && counsellors.meta.last_page > 1 && (
                    <div className="overflow-x-auto">
                        <Pagination className="mt-4 sm:mt-8 min-w-[400px]">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        className="cursor-pointer"
                                        size="default"
                                        onClick={() => handlePageChange(counsellors.meta.current_page - 1)}
                                        disabled={counsellors.meta.current_page === 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: counsellors.meta.last_page }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        {typeof page === 'string' ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                className="cursor-pointer"
                                                size="default"
                                                onClick={() => handlePageChange(page)}
                                                isActive={page === counsellors.meta.current_page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        className="cursor-pointer"
                                        size="default"
                                        onClick={() => handlePageChange(counsellors.meta.current_page + 1)}
                                        disabled={counsellors.meta.current_page === counsellors.meta.last_page}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Unified Remarks Sheet */}
                <Sheet open={isRemarksSheetOpen} onOpenChange={setIsRemarksSheetOpen}>
                    <SheetContent className="!w-[800px] sm:!w-[1000px] lg:!w-[1200px] !max-w-none">
                        <SheetHeader>
                            <SheetTitle className="text-lg sm:text-xl">Remarks for {selectedCounsellor?.user?.name}</SheetTitle>
                            <SheetDescription className="text-sm">
                                Add new remarks and view existing ones for this counsellor.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            {/* Add/Edit Remark Form */}
                            <div className="grid gap-3">
                                <h3 className="text-sm font-medium mb-3">
                                    {isEditing ? 'Edit Remark' : 'Add New Remark'}
                                </h3>
                                <form onSubmit={isEditing ? handleUpdateRemark : handleSubmitRemark} className="space-y-4">
                                    {/* Remark Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="remark_date">Remark Date <span className="text-red-600">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !data.remark_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.remark_date ? format(new Date(data.remark_date), 'PPP') : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.remark_date ? new Date(data.remark_date) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setData('remark_date', format(date, 'yyyy-MM-dd'));
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {/* Remark Text */}
                                    <div className="space-y-2">
                                        <Label htmlFor="remark">Remark <span className="text-red-600">*</span></Label>
                                        <Textarea
                                            id="remark"
                                            name="remark"
                                            value={data.remark}
                                            onChange={handleInput}
                                            placeholder="Enter your remark about this counsellor..."
                                            rows={4}
                                            maxLength={1000}
                                            required
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Maximum 1000 characters</span>
                                            <span>{data.remark.length}/1000</span>
                                        </div>
                                    </div>
                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-2">
                                        {isEditing && (
                                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit">
                                            {isEditing ? 'Update Remark' : 'Add Remark'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            {/* Remarks Table */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Existing Remarks</h3>
                                {remarks.length > 0 ? (
                                    <div className="w-full rounded border border-border bg-background shadow-sm overflow-x-auto">
                                        <div className="min-w-[700px] flex items-center px-2 sm:px-4 py-2 font-semibold text-gray-700 border-b text-xs sm:text-sm">
                                            <div className="w-24">Date</div>
                                            <div className="flex-1">Remark</div>
                                            <div className="w-32">Added By</div>
                                            <div className="w-32">Created</div>
                                            <div className="w-32">Updated</div>
                                            <div className="w-16 text-center">Actions</div>
                                        </div>
                                        {remarks.map((remark) => (
                                            <div key={remark.id} className="flex items-center px-2 sm:px-4 py-3 border-b last:border-b-0 text-xs sm:text-sm hover:bg-gray-50">
                                                <div className="w-24 font-medium">
                                                    {remark.created_at}
                                                </div>
                                                <div className="flex-1 pr-4">
                                                    <div className="text-sm leading-relaxed">
                                                        {remark.remark}
                                                        {remark.is_edited && (
                                                            <span className="ml-2 text-xs text-blue-600 font-medium">(edited)</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-32">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <User className="h-3 w-3" />
                                                        {remark.added_by_user?.name || '-'}
                                                    </div>
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {remark.created_at_formatted}
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {remark.updated_at_formatted}
                                                </div>
                                                <div className="w-16 text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEditRemark(remark)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-6 w-6 p-0"
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                            <MessageSquare className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-base font-medium text-gray-900">No remarks found</h3>
                                        <p className="text-sm text-gray-500">
                                            Add your first remark using the form above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
