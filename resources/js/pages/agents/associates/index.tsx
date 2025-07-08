import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Edit, Eye, Plus, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import StatsCard from '@/components/stats-card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AssociateResource, BreadcrumbItem, SharedData } from '@/types';
import { format } from 'date-fns';
import { Loader2, RotateCcw, Search } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
    associates: AssociateResource;
    associatesTotal: number;
    associatesActive: number;
    countries?: { id: string; name: string; flag?: string }[];
    filters?: {
        keyword?: string;
        email?: string;
        status?: string;
        category?: string;
        country_id?: string;
    };
}

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'platinum', label: 'Platinum' },
];
const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

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

export default function AssociatesIndex({ associates, associatesTotal, associatesActive, countries = [], filters = {} }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [keyword, setKeyword] = useState(filters.keyword || '');
    const [email, setEmail] = useState(filters.email || '');
    const [statusValue, setStatusValue] = useState(filters.status || 'all');
    const [statusOpen, setStatusOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState(filters.category || 'all');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [countryValue, setCountryValue] = useState(filters.country_id || 'all');
    const [countryOpen, setCountryOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialFilters, setInitialFilters] = useState({
        status: 'all',
        country: 'all',
        keyword: '',
        email: '',
        category: 'all',
    });

    const hasFilterChanges = () => {
        return (
            statusValue !== initialFilters.status ||
            countryValue !== initialFilters.country ||
            keyword !== initialFilters.keyword ||
            email !== initialFilters.email ||
            categoryValue !== initialFilters.category
        );
    };

    const hasActiveFilters = () => {
        return statusValue !== 'all' || countryValue !== 'all' || keyword !== '' || email !== '' || categoryValue !== 'all';
    };
    const handlePageChange = (page: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    const handleSearch = () => {
        const url = new URL(window.location.href);
        if (keyword) url.searchParams.set('filter[keyword]', keyword);
        else url.searchParams.delete('filter[keyword]');
        if (email) url.searchParams.set('filter[email]', email);
        else url.searchParams.delete('filter[email]');
        if (statusValue && statusValue !== 'all') url.searchParams.set('filter[status]', statusValue);
        else url.searchParams.delete('filter[status]');
        if (categoryValue && categoryValue !== 'all') url.searchParams.set('filter[category]', categoryValue);
        else url.searchParams.delete('filter[category]');
        if (countryValue && countryValue !== 'all') url.searchParams.set('filter[country_id]', countryValue);
        else url.searchParams.delete('filter[country_id]');
        url.searchParams.delete('page');
        setIsLoading(true);
        router.visit(url.toString(), { onFinish: () => setIsLoading(false), onError: () => setIsLoading(false) });
    };
    const handleReset = () => {
        setKeyword('');
        setEmail('');
        setStatusValue('all');
        setCategoryValue('all');
        setCountryValue('all');
        setIsLoading(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('filter[keyword]');
        url.searchParams.delete('filter[email]');
        url.searchParams.delete('filter[status]');
        url.searchParams.delete('filter[category]');
        url.searchParams.delete('filter[country_id]');
        url.searchParams.delete('page');
        router.visit(url.toString(), { onFinish: () => setIsLoading(false), onError: () => setIsLoading(false) });
    };

    useEffect(() => {
        if (flash?.success) {
            // Show success message
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Associates" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Associates" description="Manage your associates and their contact information" />
                    </div>
                    <Link href={route('agents:associates:create')} className="w-full sm:w-auto">
                        <Button variant="default" className="w-full cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Associate
                        </Button>
                    </Link>
                </div>
                {/* Filters Row - Processing Offices Style */}
                <div className="mb-2 flex w-full flex-row flex-wrap gap-4">
                    {/* Status Filter */}
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <Label htmlFor="status-filter" className="text-sm font-medium">
                            Status
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
                                    <span className="truncate">{statusOptions.find((opt) => opt.value === statusValue)?.label || 'All Status'}</span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[160px]">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {statusOptions.map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                    onSelect={() => {
                                                        setStatusValue(opt.value);
                                                        setStatusOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn('mr-2 h-4 w-4', statusValue === opt.value ? 'opacity-100' : 'opacity-0')} />
                                                    {opt.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Category Filter */}
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <Label htmlFor="category-filter" className="text-sm font-medium">
                            Category
                        </Label>
                        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={categoryOpen}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <span className="truncate">
                                        {categoryOptions.find((opt) => opt.value === categoryValue)?.label || 'All Categories'}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[160px]">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {categoryOptions.map((opt) => (
                                                <CommandItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                    onSelect={() => {
                                                        setCategoryValue(opt.value);
                                                        setCategoryOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn('mr-2 h-4 w-4', categoryValue === opt.value ? 'opacity-100' : 'opacity-0')}
                                                    />
                                                    {opt.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Country Filter */}
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <Label htmlFor="country-filter" className="text-sm font-medium">
                            Country
                        </Label>
                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={countryOpen}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <div className="flex min-w-0 items-center space-x-2">
                                        {countryValue !== 'all' && (
                                            <img
                                                src={countries.find((c) => c.id === countryValue)?.flag}
                                                alt=""
                                                className="h-3 w-4 flex-shrink-0 rounded"
                                            />
                                        )}
                                        <span className="truncate">{countries.find((c) => c.id === countryValue)?.name || 'All Countries'}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 md:w-[220px]">
                                <Command>
                                    <CommandInput placeholder="Search countries..." />
                                    <CommandList>
                                        <CommandEmpty>No country found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value="all"
                                                onSelect={() => {
                                                    setCountryValue('all');
                                                    setCountryOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', countryValue === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                All Countries
                                            </CommandItem>
                                            {countries.map((c) => (
                                                <CommandItem
                                                    key={c.id}
                                                    value={c.name}
                                                    onSelect={() => {
                                                        setCountryValue(c.id);
                                                        setCountryOpen(false);
                                                    }}
                                                >
                                                    <Check className={cn('mr-2 h-4 w-4', countryValue === c.id ? 'opacity-100' : 'opacity-0')} />
                                                    <div className="flex min-w-0 items-center space-x-2">
                                                        {c.flag && <img src={c.flag} alt={c.name} className="h-3 w-4 flex-shrink-0 rounded" />}
                                                        <span className="truncate">{c.name}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Email Filter */}
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Search by email..."
                            disabled={isLoading}
                        />
                    </div>
                    {/* Keyword Filter */}
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <Label htmlFor="keyword" className="text-sm font-medium">
                            Keyword
                        </Label>
                        <Input
                            id="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search by name or contact..."
                            disabled={isLoading}
                        />
                    </div>
                    {/* Search/Reset Buttons */}
                    <div className="flex min-w-[180px] flex-1 flex-row flex-nowrap items-end gap-2">
                        <Button type="button" variant="default" onClick={handleSearch} disabled={isLoading || !hasFilterChanges()} className="flex-1">
                            <Search className="h-4 w-4" />
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading || !hasActiveFilters()}
                            className="min-w-[100px]"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {/* Stats Cards */}
                <div className="mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
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
                                <h3 className="mb-2 text-lg font-semibold">No associates found</h3>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {associates.data.map((associate) => (
                                <Card key={associate.id} className="transition-shadow hover:shadow-md">
                                    <CardContent className="p-4 sm:p-6">
                                        {/* Header */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold">{associate.associate_name}</h3>
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
                                        <div className="mb-4 space-y-2">
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
                                                    <Edit className="mr-1 h-3 w-3" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={route('agents:associates:show', { associate: associate.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="mr-1 h-3 w-3" />
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
