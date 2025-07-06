import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { CounsellorResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Users, Check, Target, MessageSquare, Building2, User, Pencil, Search, RotateCcw, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2 } from 'lucide-react';

interface CounsellorRemark {
    id: string;
    remark: string;
    remark_date: string;
    remark_date_formatted: string;
    added_by_user: {
        id: string;
        name: string;
    };
    created_at: string;
    created_at_formatted: string;
    updated_at: string;
    updated_at_formatted: string;
    is_edited: boolean;
}

interface CounsellorTarget {
    id: string;
    number_of_applications: number;
    year: number;
    description: string;
    added_by_user: {
        id: string;
        name: string;
    };
    created_at: string;
    created_at_formatted: string;
    updated_at: string;
    updated_at_formatted: string;
    is_edited: boolean;
}

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

// Define filter type and default
const DEFAULT_FILTERS = {
    status: 'all',
    branch: 'all',
    keyword: '',
    email: '',
    export: 'all',
};

type FilterState = typeof DEFAULT_FILTERS;

export default function CounsellorsIndex({ counsellors, counsellorsTotal, counsellorsActive, branches }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCounsellor, setSelectedCounsellor] = useState<CounsellorResource['data'][0] | null>(null);
    const [remarks, setRemarks] = useState<CounsellorRemark[]>([]);
    const [targets, setTargets] = useState<CounsellorTarget[]>([]);
    const [isRemarksSheetOpen, setIsRemarksSheetOpen] = useState(false);
    const [isTargetsSheetOpen, setIsTargetsSheetOpen] = useState(false);
    const [editingRemark, setEditingRemark] = useState<CounsellorRemark | null>(null);
    const [editingTarget, setEditingTarget] = useState<CounsellorTarget | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingTarget, setIsEditingTarget] = useState(false);

    // Refactored filter state
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [branchOpen, setBranchOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [initialFilters, setInitialFilters] = useState(DEFAULT_FILTERS);
    const [error, setError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, put } = useForm({
        remark: '',
        remark_date: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: targetData, setData: setTargetData, post: postTarget, processing: processingTarget, errors: targetErrors, put: putTarget } = useForm({
        number_of_applications: '',
        year: new Date().getFullYear(),
        description: '',
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Effect: initialize filters from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('filter[status]') || urlParams.get('status') || 'all';
        const branch = urlParams.get('filter[branch_id]') || urlParams.get('branch_id') || 'all';
        const keyword = urlParams.get('filter[keyword]') || urlParams.get('keyword') || '';
        const email = urlParams.get('filter[contact_person_email]') || urlParams.get('contact_person_email') || '';
        const exportType = urlParams.get('filter[export]') || urlParams.get('export') || 'all';
        setFilters({ status, branch, keyword, email, export: exportType });
        setInitialFilters({ status, branch, keyword, email, export: exportType });
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
            let paramKey = key;
            if (key === 'branch') paramKey = 'branch_id';
            if (key === 'email') paramKey = 'contact_person_email';
            if (key === 'export') paramKey = 'export';
            if (key === 'status') paramKey = 'status';
            if (value !== 'all' && value !== '') url.searchParams.set(`filter[${paramKey}]`, value);
            else url.searchParams.delete(`filter[${paramKey}]`);
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
        setFilters(DEFAULT_FILTERS);
        setIsLoading(true);
        setError(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('keyword');
        url.searchParams.delete('contact_person_email');
        url.searchParams.delete('status');
        url.searchParams.delete('branch_id');
        url.searchParams.delete('export');
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => {
                setIsLoading(false);
                setError('Failed to reset filters. Please try again.');
            },
        });
    };

    // Filter helpers
    const getSelectedStatusName = () => {
        if (filters.status === 'all') return 'All Status';
        return filters.status === 'active' ? 'Active' : 'Inactive';
    };
    const getSelectedBranchName = () => {
        if (filters.branch === 'all') return 'All Branches';
        const branch = branches?.find((b: { id: string; name: string }) => b.id === filters.branch);
        return branch ? branch.name : 'All Branches';
    };
    const getSelectedExportName = () => {
        switch (filters.export) {
            case 'all':
                return 'Download CSV';
            case 'allowed':
                return 'Allowed';
            case 'allowed_without_contact':
                return 'Allowed without Contact';
            case 'not_allowed':
                return 'Not Allowed';
            default:
                return 'Download CSV';
        }
    };
    const hasFilterChanges = () => {
        return Object.keys(DEFAULT_FILTERS).some(
            (key) => filters[key as keyof FilterState] !== initialFilters[key as keyof FilterState]
        );
    };
    const hasActiveFilters = () => {
        return Object.entries(filters).some(([key, value]) => value !== DEFAULT_FILTERS[key as keyof FilterState]);
    };

    const handleOpenRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        setSelectedCounsellor(counsellor);
        setIsRemarksSheetOpen(true);
        // Manual reset of form data
        setData('remark', '');
        setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
        console.log('Form reset when opening remarks sheet');
        // Fetch remarks for this counsellor
        await fetchRemarks(counsellor);
    };

    const handleSubmitRemark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor) return;

        post(route('agents:counsellors:remarks:store', { counsellor: selectedCounsellor.id }), {
            onSuccess: () => {
                // Manual reset of form data
                setData('remark', '');
                setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
                console.log('Form reset after successful submission');
                // Add a small delay to ensure the data is saved before fetching
                setTimeout(() => {
                    fetchRemarks(selectedCounsellor);
                }, 500);
            },
        });
    };

    const fetchRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        try {
            console.log('Fetching remarks for counsellor:', counsellor.id);
            const response = await fetch(`/agents/counsellors/${counsellor.id}/remarks`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Remarks data received:', data);
            setRemarks(data.data || []);
            console.log('Remarks state updated with:', data.data || []);
        } catch (error) {
            console.error('Error fetching remarks:', error);
            setRemarks([]);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleEditRemark = (remark: CounsellorRemark) => {
        setEditingRemark(remark);
        setIsEditing(true);
        setData('remark', remark.remark);
        setData('remark_date', remark.remark_date);
    };

    const handleCancelEdit = () => {
        setEditingRemark(null);
        setIsEditing(false);
        setData('remark', '');
        setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
    };

        const handleUpdateRemark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor || !editingRemark) return;

        put(route('agents:counsellors:remarks:update', {
            counsellor: selectedCounsellor.id,
            remark: editingRemark.id
        }), {
            onSuccess: () => {
                handleCancelEdit();
                // Add a small delay to ensure the data is saved before fetching
                setTimeout(() => {
                    fetchRemarks(selectedCounsellor);
                }, 500);
            },
        });
    };

    // Targets functionality
    const handleOpenTargets = async (counsellor: CounsellorResource['data'][0]) => {
        setSelectedCounsellor(counsellor);
        setIsTargetsSheetOpen(true);
        // Manual reset of form data
        setTargetData('number_of_applications', '');
        setTargetData('year', new Date().getFullYear());
        setTargetData('description', '');
        console.log('Form reset when opening targets sheet');
        // Fetch targets for this counsellor
        await fetchTargets(counsellor);
    };

    const fetchTargets = async (counsellor: CounsellorResource['data'][0]) => {
        try {
            console.log('Fetching targets for counsellor:', counsellor.id);
            const response = await fetch(`/agents/counsellors/${counsellor.id}/targets`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Targets data received:', data);
            setTargets(data.data || []);
            console.log('Targets state updated with:', data.data || []);
        } catch (error) {
            console.error('Error fetching targets:', error);
            setTargets([]);
        }
    };

    const handleSubmitTarget = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor) return;

        postTarget(route('agents:counsellors:targets:store', { counsellor: selectedCounsellor.id }), {
            onSuccess: () => {
                // Manual reset of form data
                setTargetData('number_of_applications', '');
                setTargetData('year', new Date().getFullYear());
                setTargetData('description', '');
                console.log('Form reset after successful submission');
                // Add a small delay to ensure the data is saved before fetching
                setTimeout(() => {
                    fetchTargets(selectedCounsellor);
                }, 500);
            },
        });
    };

    const handleEditTarget = (target: CounsellorTarget) => {
        setEditingTarget(target);
        setIsEditingTarget(true);
        setTargetData('number_of_applications', target.number_of_applications.toString());
        setTargetData('year', new Date().getFullYear());
        setTargetData('description', target.description);
    };

    const handleCancelEditTarget = () => {
        setEditingTarget(null);
        setIsEditingTarget(false);
        setTargetData('number_of_applications', '');
        setTargetData('year', new Date().getFullYear());
        setTargetData('description', '');
    };

    const handleUpdateTarget = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor || !editingTarget) return;

        putTarget(route('agents:counsellors:targets:update', {
            counsellor: selectedCounsellor.id,
            target: editingTarget.id
        }), {
            onSuccess: () => {
                handleCancelEditTarget();
                // Add a small delay to ensure the data is saved before fetching
                setTimeout(() => {
                    fetchTargets(selectedCounsellor);
                }, 500);
            },
        });
    };

    const handleTargetInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTargetData(name as keyof typeof targetData, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Counsellors" />
            <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Counsellors" description="Manage your counsellors and their contact information" />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link href={route('agents:counsellors:create')} className="w-full sm:w-auto">
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

                    {/* Branch Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="branch-filter" className="text-sm font-medium">
                            Filter by Branch
                        </Label>
                        <Popover open={branchOpen} onOpenChange={setBranchOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={branchOpen}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <span className="truncate">{getSelectedBranchName()}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[220px]">
                                <Command>
                                    <CommandInput placeholder="Search branches..." />
                                    <CommandList>
                                        <CommandEmpty>No branch found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem value="all" onSelect={() => updateFilter('branch', 'all')}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.branch === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                All Branches
                                            </CommandItem>
                                            {branches?.map((branch) => (
                                                <CommandItem
                                                    key={branch.id}
                                                    value={branch.name}
                                                    onSelect={() => updateFilter('branch', branch.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            filters.branch === branch.id ? 'opacity-100' : 'opacity-0',
                                                        )}
                                                    />
                                                    <span className="truncate">{branch.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Contact Email Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="contact_person_email" className="text-sm font-medium">
                            Contact Email
                        </Label>
                        <Input
                            id="contact_person_email"
                            type="text"
                            value={filters.email}
                            onChange={(e) => updateFilter('email', e.target.value)}
                            placeholder="Search by email"
                        />
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

                    {/* Export Filter */}
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="export-filter" className="text-sm font-medium">
                            Export Type
                        </Label>
                        <Popover open={exportOpen} onOpenChange={setExportOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={exportOpen}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <span className="truncate">{getSelectedExportName()}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[200px]">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            <CommandItem value="all" onSelect={() => { updateFilter('export', 'all'); setExportOpen(false); }}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.export === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                Download CSV
                                            </CommandItem>
                                            <CommandItem value="allowed" onSelect={() => { updateFilter('export', 'allowed'); setExportOpen(false); }}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.export === 'allowed' ? 'opacity-100' : 'opacity-0')} />
                                                Allowed
                                            </CommandItem>
                                            <CommandItem value="allowed_without_contact" onSelect={() => { updateFilter('export', 'allowed_without_contact'); setExportOpen(false); }}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.export === 'allowed_without_contact' ? 'opacity-100' : 'opacity-0')} />
                                                Allowed without Contact
                                            </CommandItem>
                                            <CommandItem value="not_allowed" onSelect={() => { updateFilter('export', 'not_allowed'); setExportOpen(false); }}>
                                                <Check className={cn('mr-2 h-4 w-4', filters.export === 'not_allowed' ? 'opacity-100' : 'opacity-0')} />
                                                Not Allowed
                                            </CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
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
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1"
                                                onClick={() => handleOpenTargets(counsellor)}
                                            >
                                                <Target className="h-3 w-3 mr-1" />
                                                Add Target
                                            </Button>
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
                                <Link href={route('agents:counsellors:create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add First Counsellor
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
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
                                                    disabled={(date) => {
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        return date < today;
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.remark_date && (
                                            <p className="text-sm text-red-600">{errors.remark_date}</p>
                                        )}
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
                                        {errors.remark && (
                                            <p className="text-sm text-red-600">{errors.remark}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-2">
                                        {isEditing && (
                                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" disabled={processing}>
                                            {processing
                                                ? (isEditing ? 'Updating Remark...' : 'Adding Remark...')
                                                : (isEditing ? 'Update Remark' : 'Add Remark')
                                            }
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
                                                    {remark.remark_date_formatted}
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
                                                        {remark.added_by_user.name}
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

                {/* Unified Targets Sheet */}
                <Sheet open={isTargetsSheetOpen} onOpenChange={setIsTargetsSheetOpen}>
                    <SheetContent className="!w-[800px] sm:!w-[1000px] lg:!w-[1200px] !max-w-none">
                        <SheetHeader>
                            <SheetTitle className="text-lg sm:text-xl">Targets for {selectedCounsellor?.user?.name}</SheetTitle>
                            <SheetDescription className="text-sm">
                                Add new targets and view existing ones for this counsellor.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            {/* Add/Edit Target Form */}
                            <div className="grid gap-3">
                                <h3 className="text-sm font-medium mb-3">
                                    {isEditingTarget ? 'Edit Target' : 'Add New Target'}
                                </h3>
                                <form onSubmit={isEditingTarget ? handleUpdateTarget : handleSubmitTarget} className="space-y-4">
                                    {/* Number of Applications */}
                                    <div className="space-y-2">
                                        <Label htmlFor="number_of_applications">Number of Applications <span className="text-red-600">*</span></Label>
                                        <Input
                                            id="number_of_applications"
                                            name="number_of_applications"
                                            type="number"
                                            value={targetData.number_of_applications}
                                            onChange={handleTargetInput}
                                            min="1"
                                            required
                                        />
                                        {targetErrors.number_of_applications && (
                                            <p className="text-sm text-red-600">{targetErrors.number_of_applications}</p>
                                        )}
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year <span className="text-red-600">*</span></Label>
                                        <Input
                                            id="year"
                                            name="year"
                                            type="number"
                                            value={targetData.year}
                                            onChange={handleTargetInput}
                                            min="2020"
                                            max="2030"
                                            required
                                            readOnly
                                            className="bg-gray-50 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-muted-foreground">Year is automatically set to current year</p>
                                        {targetErrors.year && (
                                            <p className="text-sm text-red-600">{targetErrors.year}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description <span className="text-red-600">*</span></Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={targetData.description}
                                            onChange={handleTargetInput}
                                            placeholder="Enter target description..."
                                            rows={4}
                                            maxLength={1000}
                                            required
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Maximum 1000 characters</span>
                                            <span>{targetData.description.length}/1000</span>
                                        </div>
                                        {targetErrors.description && (
                                            <p className="text-sm text-red-600">{targetErrors.description}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end gap-2">
                                        {isEditingTarget && (
                                            <Button type="button" variant="outline" onClick={handleCancelEditTarget}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" disabled={processingTarget}>
                                            {processingTarget
                                                ? (isEditingTarget ? 'Updating Target...' : 'Adding Target...')
                                                : (isEditingTarget ? 'Update Target' : 'Add Target')
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* Targets Table */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Existing Targets</h3>
                                {targets.length > 0 ? (
                                    <div className="w-full rounded border border-border bg-background shadow-sm overflow-x-auto">
                                        <div className="min-w-[700px] flex items-center px-2 sm:px-4 py-2 font-semibold text-gray-700 border-b text-xs sm:text-sm">
                                            <div className="w-24">Year</div>
                                            <div className="w-32">Applications</div>
                                            <div className="flex-1">Description</div>
                                            <div className="w-32">Added By</div>
                                            <div className="w-32">Created</div>
                                            <div className="w-32">Updated</div>
                                            <div className="w-16 text-center">Actions</div>
                                        </div>
                                        {targets.map((target) => (
                                            <div key={target.id} className="flex items-center px-2 sm:px-4 py-3 border-b last:border-b-0 text-xs sm:text-sm hover:bg-gray-50">
                                                <div className="w-24 font-medium">
                                                    {target.year}
                                                </div>
                                                <div className="w-32 font-medium">
                                                    {target.number_of_applications}
                                                </div>
                                                <div className="flex-1 pr-4">
                                                    <div className="text-sm leading-relaxed">
                                                        {target.description}
                                                        {target.is_edited && (
                                                            <span className="ml-2 text-xs text-blue-600 font-medium">(edited)</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-32">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <User className="h-3 w-3" />
                                                        {target.added_by_user.name}
                                                    </div>
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {target.created_at_formatted}
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {target.updated_at_formatted}
                                                </div>
                                                <div className="w-16 text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEditTarget(target)}
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
                                            <Target className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-base font-medium text-gray-900">No targets found</h3>
                                        <p className="text-sm text-gray-500">
                                            Add your first target using the form above.
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
