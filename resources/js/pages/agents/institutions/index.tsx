import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
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
import { Building2, Check, ChevronsUpDown, ChevronDown, ChevronRight, Edit, FileText, Loader2, Plus, Users, BookOpen, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

interface Props {
    institutions: InstitutionResource;
    repCountries: RepCountry[];
    institutionsTotal: number;
    institutionsActive: number;
    institutionsDirect: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/institutions' },
];

export default function InstitutionsIndex({ institutions, repCountries, institutionsTotal, institutionsActive, institutionsDirect }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [institutionName, setInstitutionName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [keyword, setKeyword] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState<{ [id: string]: boolean }>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);

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
        const name = urlParams.get('institution_name') || '';
        const email = urlParams.get('contact_person_email') || '';
        const kw = urlParams.get('keyword') || '';
        const start = urlParams.get('contract_expiry_start');
        const end = urlParams.get('contract_expiry_end');
        if (countryId) {
            setSelectedCountry(countryId);
        }
        if (type) {
            setSelectedType(type);
        }
        if (start || end) {
            setDateRange({
                from: start ? new Date(start) : undefined,
                to: end ? new Date(end) : undefined,
            });
        }
        setInstitutionName(name);
        setContactEmail(email);
        setKeyword(kw);
    }, []);

    const handlePageChange = (page: number) => {
        // Preserve all current query params and just update the page param
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    const handleCountryFilter = (countryId: string) => {
        setSelectedCountry(countryId);
        setCountryOpen(false);
    };

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
        setTypeOpen(false);
    };

    const handleSearch = () => {
        const url = new URL(window.location.href);
        if (selectedCountry && selectedCountry !== 'all') url.searchParams.set('country_id', selectedCountry);
        else url.searchParams.delete('country_id');
        if (selectedType && selectedType !== 'all') url.searchParams.set('type', selectedType);
        else url.searchParams.delete('type');
        if (institutionName) url.searchParams.set('institution_name', institutionName);
        else url.searchParams.delete('institution_name');
        if (contactEmail) url.searchParams.set('contact_person_email', contactEmail);
        else url.searchParams.delete('contact_person_email');
        if (keyword) url.searchParams.set('keyword', keyword);
        else url.searchParams.delete('keyword');
        if (dateRange?.from) url.searchParams.set('contract_expiry_start', dateRange.from.toISOString().slice(0, 10));
        else url.searchParams.delete('contract_expiry_start');
        if (dateRange?.to) url.searchParams.set('contract_expiry_end', dateRange.to.toISOString().slice(0, 10));
        else url.searchParams.delete('contract_expiry_end');
        url.searchParams.delete('page');
        setIsLoading(true);
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const handleReset = () => {
        setInstitutionName('');
        setContactEmail('');
        setKeyword('');
        setDateRange(undefined);
        setSelectedCountry('all');
        setSelectedType('all');
        setIsLoading(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('institution_name');
        url.searchParams.delete('contact_person_email');
        url.searchParams.delete('keyword');
        url.searchParams.delete('contract_expiry_start');
        url.searchParams.delete('contract_expiry_end');
        url.searchParams.delete('country_id');
        url.searchParams.delete('type');
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

    const toggleDetails = (id: string) => {
        setDetailsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Institutions" />

            <div className="flex h-full flex-1 flex-col space-y-6 overflow-x-hidden p-2 sm:p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Institutions" description="Manage educational institutions and their partnerships" />
                    </div>
                    <Link href={route('agents:institutions:create')} className="w-full md:w-auto">
                        <Button className="w-full cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Institution
                        </Button>
                    </Link>
                </div>

                {/* Stats and Filter Section */}
                <div className="flex flex-col gap-6">
                    {/* Filters Row: Country, Type, and Advanced Search */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
                        {/* Country Filter */}
                        <div className="flex w-full flex-col gap-1 md:max-w-[220px]">
                            <Label htmlFor="country-filter" className="text-sm font-medium">
                                Filter by Country
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
                                <PopoverContent className="w-full p-0 md:w-[220px]">
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
                        <div className="flex w-full flex-col gap-1 md:max-w-[160px]">
                            <Label htmlFor="type-filter" className="text-sm font-medium">
                                Filter by Type
                            </Label>
                            <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={typeOpen}
                                        className="w-full justify-between"
                                        disabled={isLoading}
                                    >
                                        <span className="truncate">{getSelectedTypeName()}</span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 md:w-[160px]">
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
                        {/* Institution Name Filter */}
                        <div className="flex w-full flex-col gap-1 md:max-w-[200px]">
                            <Label htmlFor="institution_name" className="text-sm font-medium">
                                Institution Name
                            </Label>
                            <Input
                                id="institution_name"
                                type="text"
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                placeholder="Search by name"
                            />
                        </div>
                        {/* Contact Email Filter */}
                        <div className="flex w-full flex-col gap-1 md:max-w-[200px]">
                            <Label htmlFor="contact_person_email" className="text-sm font-medium">
                                Contact Email
                            </Label>
                            <Input
                                id="contact_person_email"
                                type="text"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="Search by email"
                            />
                        </div>
                        {/* Keyword Filter */}
                        <div className="flex w-full flex-col gap-1 md:max-w-[180px]">
                            <Label htmlFor="keyword" className="text-sm font-medium">
                                Keyword
                            </Label>
                            <Input id="keyword" type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Any keyword" />
                        </div>
                        {/* Contract Expiry Date Range Filter */}
                        <div className="flex w-full flex-col gap-1 md:max-w-[240px]">
                            <Label htmlFor="contract_expiry_date" className="text-sm font-medium">
                                Contract Expiry Date Range
                            </Label>
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" type="button">
                                        {dateRange?.from && dateRange?.to
                                            ? `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`
                                            : 'Pick a date range'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* Search/Reset Buttons */}
                        <div className="flex flex-row gap-2 pt-4 md:pt-0">
                            <Button type="button" variant="default" onClick={handleSearch} disabled={isLoading}>
                                Search
                            </Button>
                            <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                                Reset
                            </Button>
                        </div>
                    </div>

                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

                    {/* Stats Cards */}
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Total Institutions</p>
                                        <p className="text-xl font-semibold sm:text-2xl">{institutionsTotal}</p>
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
                                        <p className="text-sm text-muted-foreground">Active</p>
                                        <p className="text-xl font-semibold sm:text-2xl">{institutionsActive}</p>
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
                                        <p className="text-sm text-muted-foreground">Direct</p>
                                        <p className="text-xl font-semibold sm:text-2xl">{institutionsDirect}</p>
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

                {/* List with Expandable Rows */}
                {!isLoading && institutions.data.length !== 0 &&(
                    <div className="w-full rounded border border-border bg-background shadow-md overflow-x-auto">
                        <div className="min-w-[900px] flex items-center px-2 sm:px-4 py-2 font-semibold text-gray-700 border-b text-xs sm:text-sm">
                            <div className="w-8" />
                            <div className="w-12" />
                            <div className="flex-1">Name</div>
                            <div className="w-24">Institute Type</div>
                            <div className="w-32">Country</div>
                            <div className="w-48">Campus</div>
                            <div className="w-32">Added Date</div>
                            <div className="w-20 text-center">Status</div>
                            <div className="w-24 text-center">Actions</div>
                        </div>
                        { institutions.data.map((inst) => (
                            <div key={inst.id}>
                                <div
                                    className="min-w-[900px] flex items-center px-2 sm:px-4 py-2 border-b last:border-b-0 hover:bg-muted transition cursor-pointer text-xs sm:text-sm"
                                    onClick={() => handleExpand(inst.id)}
                                >
                                    <div className="w-8 flex justify-center">
                                        {expandedId === inst.id ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="w-12 flex justify-center">
                                        <Avatar>
                                            <AvatarImage src={inst.logo_url} alt={inst.institution_name} />
                                            <AvatarFallback>{inst.institution_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 truncate font-medium">{inst.institution_name}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 ml-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('agents:institutions:courses:index', { institution: inst.id })} onClick={e => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                                                    <BookOpen className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>View Courses</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={route('agents:institutions:courses:create', { institution: inst.id })} onClick={e => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                                                    <PlusCircle className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Add Course</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-24">
                                        <Badge
                                            variant="default"
                                            className={
                                                inst.institute_type === 'direct'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                            }
                                        >
                                            {inst.institute_type.charAt(0).toUpperCase() + inst.institute_type.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="w-32 flex items-center gap-2">
                                        {inst.rep_country?.country?.flag && (
                                            <img
                                                src={inst.rep_country.country.flag}
                                                alt={inst.rep_country.country.name}
                                                className="h-3 w-4 rounded"
                                            />
                                        )}
                                        <span className="truncate">{inst.rep_country?.country?.name || '-'}</span>
                                    </div>
                                    <div className="w-48 truncate">{inst.campus || '-'}</div>
                                    <div className="w-32 truncate">{inst.created?.string ? format(new Date(inst.created.string), 'dd MMMM yyyy') : '-'}</div>
                                    <div className="w-20 flex justify-center" onClick={e => e.stopPropagation()}>
                                        <StatusSwitch
                                            id={inst.id}
                                            checked={inst.is_active}
                                            route={route('agents:institutions:toggle-status', inst.id)}
                                            showLabel={false}
                                        />
                                    </div>
                                    <div className="w-24 flex justify-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={route('agents:institutions:edit', inst.id)} onClick={e => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                      <Link href={route('agents:institutions:show', inst.id)}onClick={e => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon">
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Show</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                {expandedId === inst.id && (
                                    <div className="bg-muted px-4 sm:px-12 py-4 border-b last:border-b-0 text-xs sm:text-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <span className="mb-1 block text-xs font-semibold text-gray-700">Contact Person Name</span>
                                                <span className="block text-base font-semibold text-gray-900">{inst.contact_person_name}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs font-semibold text-gray-700">Email</span>
                                                <span className="block text-sm text-gray-900">{inst.contact_person_email}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs font-semibold text-gray-700">Contact No.</span>
                                                <span className="block text-sm text-gray-900">{inst.contact_person_mobile}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs font-semibold text-gray-700">Designation</span>
                                                <span className="block text-sm text-gray-900">{inst.contact_person_designation}</span>
                                            </div>
                                            <div>
                                                <span className="mb-1 block text-xs font-semibold text-gray-700">Website</span>
                                                <span className="block text-sm text-gray-900">{inst.website}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && institutions.data.length === 0 && (
                    <Card className="py-8 sm:py-12 text-center">
                        <CardContent>
                            <div className="mx-auto mb-4 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-muted">
                                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-base sm:text-lg font-semibold">No institutions found</h3>

                        </CardContent>
                    </Card>
                )}

                {/* Pagination Controls */}
                {!isLoading && institutions.meta.last_page > 1 && (
                    <div className="overflow-x-auto">
                        <Pagination className="mt-4 sm:mt-8 min-w-[400px]">
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
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
