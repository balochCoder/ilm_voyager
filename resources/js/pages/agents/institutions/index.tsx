import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
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
import { Skeleton } from '@/components/ui/skeleton';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, InstitutionResource, RepCountry, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Building2, Check, ChevronsUpDown, Edit, FileText, Globe, Loader2, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    institutions: InstitutionResource;
    repCountries: RepCountry[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/institutions' },
];

const getPageNumbers = (current: number, last: number): (number | string)[] => {
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
        if (i !== 1 && i !== last) pages.push(i);
    }
    if (current < last - 2) pages.push('...');
    if (last > 1) pages.push(last);
    return pages;
};

export default function InstitutionsIndex({ institutions, repCountries }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        }
    }, [flash]);

    // Initialize filters from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const countryId = urlParams.get('country_id');
        const type = urlParams.get('type');
        if (countryId) {
            setSelectedCountry(countryId);
        }
        if (type) {
            setSelectedType(type);
        }
    }, []);

    const handlePageChange = (page: number) => {
        const params: Record<string, any> = { page };

        router.get(route('agents:institutions:index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleCountryFilter = (countryId: string) => {
        setSelectedCountry(countryId);
        setCountryOpen(false);
        setIsLoading(true);

        const url = new URL(window.location.href);
        if (countryId === 'all') {
            url.searchParams.delete('country_id');
        } else {
            url.searchParams.set('country_id', countryId);
        }
        url.searchParams.delete('page');

        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
        setTypeOpen(false);
        setIsLoading(true);

        const url = new URL(window.location.href);
        if (type === 'all') {
            url.searchParams.delete('type');
        } else {
            url.searchParams.set('type', type);
        }
        url.searchParams.delete('page');

        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const getSelectedCountryName = () => {
        if (selectedCountry === 'all') return 'All Countries';
        const country = repCountries.find((rc) => rc.id === selectedCountry);
        return country ? country.country.name : 'All Countries';
    };

    const getSelectedTypeName = () => {
        if (selectedType === 'all') return 'All Types';
        return selectedType === 'direct' ? 'Direct' : 'Indirect';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Institutions" />

            <div className="flex h-full flex-1 flex-col space-y-6 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Institutions" />
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage educational institutions and their partnerships</p>
                    </div>
                    <Link href={route('agents:institutions:create')} className="w-full sm:w-auto">
                        <Button className="w-full cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Institution
                        </Button>
                    </Link>
                </div>

                {/* Stats and Filter Section */}
                <div className="flex flex-col gap-6">
                    {/* Filters */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Country Filter */}
                        <div className="flex w-full flex-col space-y-2 sm:max-w-[280px]">
                            <Label htmlFor="country-filter" className="text-sm font-medium">
                                Filter by Country
                            </Label>
                            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="noShadow"
                                        role="combobox"
                                        aria-expanded={countryOpen}
                                        className="w-full justify-between"
                                        disabled={isLoading}
                                    >
                                        <div className="flex min-w-0 items-center space-x-2">
                                            {selectedCountry !== 'all' && (
                                                <img
                                                    src={repCountries.find((rc) => rc.id === selectedCountry)?.country.flag}
                                                    alt=""
                                                    className="h-3 w-4 flex-shrink-0 rounded"
                                                />
                                            )}
                                            <span className="truncate">{getSelectedCountryName()}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 sm:w-[280px]">
                                    <Command>
                                        <CommandInput placeholder="Search countries..." />
                                        <CommandList>
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem value="all" onSelect={() => handleCountryFilter('all')}>
                                                    <Check className={cn('mr-2 h-4 w-4', selectedCountry === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                    All Countries
                                                </CommandItem>
                                                {repCountries.map((repCountry) => (
                                                    <CommandItem
                                                        key={repCountry.id}
                                                        value={repCountry.country.name}
                                                        onSelect={() => handleCountryFilter(repCountry.id)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                'mr-2 h-4 w-4',
                                                                selectedCountry === repCountry.id ? 'opacity-100' : 'opacity-0',
                                                            )}
                                                        />
                                                        <div className="flex min-w-0 items-center space-x-2">
                                                            <img
                                                                src={repCountry.country.flag}
                                                                alt={repCountry.country.name}
                                                                className="h-3 w-4 flex-shrink-0 rounded"
                                                            />
                                                            <span className="truncate">{repCountry.country.name}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Type Filter */}
                        <div className="flex w-full flex-col space-y-2 sm:max-w-[200px]">
                            <Label htmlFor="type-filter" className="text-sm font-medium">
                                Filter by Type
                            </Label>
                            <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="noShadow"
                                        role="combobox"
                                        aria-expanded={typeOpen}
                                        className="w-full justify-between"
                                        disabled={isLoading}
                                    >
                                        <span className="truncate">{getSelectedTypeName()}</span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 sm:w-[200px]">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                <CommandItem value="all" onSelect={() => handleTypeFilter('all')}>
                                                    <Check className={cn('mr-2 h-4 w-4', selectedType === 'all' ? 'opacity-100' : 'opacity-0')} />
                                                    All Types
                                                </CommandItem>
                                                <CommandItem value="direct" onSelect={() => handleTypeFilter('direct')}>
                                                    <Check className={cn('mr-2 h-4 w-4', selectedType === 'direct' ? 'opacity-100' : 'opacity-0')} />
                                                    Direct
                                                </CommandItem>
                                                <CommandItem value="indirect" onSelect={() => handleTypeFilter('indirect')}>
                                                    <Check
                                                        className={cn('mr-2 h-4 w-4', selectedType === 'indirect' ? 'opacity-100' : 'opacity-0')}
                                                    />
                                                    Indirect
                                                </CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {isLoading && <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />}

                    {/* Stats Cards */}
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted-foreground text-sm">Total Institutions</p>
                                        <p className="text-xl font-semibold sm:text-2xl">{institutions.meta.total}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-green-100 p-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted-foreground text-sm">Active</p>
                                        <p className="text-xl font-semibold sm:text-2xl">
                                            {institutions.data.filter((inst) => inst.is_active).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-purple-100 p-2">
                                        <Users className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted-foreground text-sm">Direct</p>
                                        <p className="text-xl font-semibold sm:text-2xl">
                                            {institutions.data.filter((inst) => inst.institute_type === 'direct').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-orange-100 p-2">
                                        <Globe className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted-foreground text-sm">Indirect</p>
                                        <p className="text-xl font-semibold sm:text-2xl">
                                            {institutions.data.filter((inst) => inst.institute_type === 'indirect').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="mb-4 flex items-center space-x-3">
                                        <Skeleton className="h-6 w-8 rounded" />
                                        <Skeleton className="h-6 w-32 rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full rounded" />
                                        <Skeleton className="h-4 w-3/4 rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Card Grid Institutions List */}
                {!isLoading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {institutions.data.map((inst) => (
                            <Card
                                key={inst.id}
                                className="bg-background text-main-foreground border-border group border shadow-md transition-all hover:shadow-lg"
                            >
                                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                    <Avatar>
                                        <AvatarImage src={inst.logo_url} alt={inst.institution_name} />
                                        <AvatarFallback>{inst.institution_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="truncate text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                                            {inst.institution_name}
                                        </CardTitle>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Badge
                                                variant="default"
                                                className={
                                                    inst.institute_type === 'direct' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }
                                            >
                                                {inst.institute_type.charAt(0).toUpperCase() + inst.institute_type.slice(1)}
                                            </Badge>
                                            <Badge variant="default" className="bg-gray-100 text-gray-700">
                                                {inst.rep_country?.country?.name || '-'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusSwitch
                                            id={inst.id}
                                            checked={inst.is_active}
                                            route={route('agents:institutions:toggle-status', inst.id)}
                                            showLabel={false}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <span className="mb-1 block text-xs font-semibold text-gray-700">Contact Name</span>
                                        <span className="block text-base font-semibold text-gray-900">{inst.contact_person_name}</span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-xs font-semibold text-gray-700">Email</span>
                                        <span className="block text-sm text-gray-900">{inst.contact_person_email}</span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-xs font-semibold text-gray-700">Mobile</span>
                                        <span className="block text-sm text-gray-900">{inst.contact_person_mobile}</span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-xs font-semibold text-gray-700">Campus</span>
                                        <span className="block text-sm text-gray-900">{inst.campus || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-xs font-semibold text-gray-700">Added Date</span>
                                        <span className="block text-sm text-gray-900">
                                            {inst.created?.string ? format(new Date(inst.created.string), 'dd MMMM yyyy') : '-'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('agents:institutions:index', inst.id)}>
                                                        <Button variant="noShadow" size="icon" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('agents:institutions:index', inst.id)}>
                                                        <Button variant="noShadow" size="icon" className="h-8 w-8">
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Show</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && institutions.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                                <Building2 className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No institutions found</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first educational institution</p>
                            <Link href={route('agents:institutions:create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Institution
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination Controls */}
                {!isLoading && institutions.meta.last_page > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(institutions.meta.current_page - 1)}
                                />
                            </PaginationItem>

                            {Array.from({ length: institutions.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    {typeof page === 'string' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            className="cursor-pointer"
                                            size="default"
                                            onClick={() => handlePageChange(page)}
                                            isActive={page === institutions.meta.current_page}
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
                                    onClick={() => handlePageChange(institutions.meta.current_page + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
}
