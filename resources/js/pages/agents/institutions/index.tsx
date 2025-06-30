import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Institution, PaginationData, SharedData, RepCountry, Currency } from '@/types';
import { Button } from '@/components/ui/button';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Check, ChevronsUpDown, Loader2, Loader, Edit, Building2, Calendar, FileText, ArrowUpDown, ChevronDown, ChevronUp, Globe, DollarSign, Users, Mail, Phone } from 'lucide-react';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    institutions: {
        data: Institution[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    repCountries: RepCountry[];
    currencies: Currency[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/institutions' },
];

const getPageNumbers = (current: number, last: number) => {
    const pages: (number | string)[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
        if (i !== 1 && i !== last) pages.push(i);
    }
    if (current < last - 2) pages.push('...');
    if (last > 1) pages.push(last);
    return pages;
};

export default function InstitutionsIndex({ institutions, repCountries, currencies }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

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

    const toggleCardExpansion = (institutionId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [institutionId]: !prev[institutionId]
        }));
    };

    const getSelectedCountryName = () => {
        if (selectedCountry === 'all') return 'All Countries';
        const country = repCountries.find(rc => rc.id === selectedCountry);
        return country ? country.country.name : 'All Countries';
    };

    const getSelectedTypeName = () => {
        if (selectedType === 'all') return 'All Types';
        return selectedType === 'direct' ? 'Direct' : 'Indirect';
    };

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'excellent': return 'bg-green-100 text-green-800';
            case 'good': return 'bg-blue-100 text-blue-800';
            case 'average': return 'bg-yellow-100 text-yellow-800';
            case 'below_average': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getQualityLabel = (quality: string) => {
        switch (quality) {
            case 'excellent': return 'Excellent';
            case 'good': return 'Good';
            case 'average': return 'Average';
            case 'below_average': return 'Below Average';
            default: return quality;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Institutions" />

            <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-6 overflow-x-hidden">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <Heading title='Institutions' />
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Manage educational institutions and their partnerships
                        </p>
                    </div>
                    <Link href={route('agents:institutions:create')} className="w-full sm:w-auto">
                        <Button className='cursor-pointer w-full'>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Institution
                        </Button>
                    </Link>
                </div>

                {/* Stats and Filter Section */}
                <div className="flex flex-col gap-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Country Filter */}
                        <div className="flex flex-col space-y-2 w-full sm:max-w-[280px]">
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
                                        <div className="flex items-center space-x-2 min-w-0">
                                            {selectedCountry !== 'all' && (
                                                <img
                                                    src={repCountries.find(rc => rc.id === selectedCountry)?.country.flag}
                                                    alt=""
                                                    className="w-4 h-3 rounded flex-shrink-0"
                                                />
                                            )}
                                            <span className="truncate">{getSelectedCountryName()}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full sm:w-[280px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search countries..." />
                                        <CommandList>
                                            <CommandEmpty>No country found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="all"
                                                    onSelect={() => handleCountryFilter('all')}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCountry === "all" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
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
                                                                "mr-2 h-4 w-4",
                                                                selectedCountry === repCountry.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex items-center space-x-2 min-w-0">
                                                            <img
                                                                src={repCountry.country.flag}
                                                                alt={repCountry.country.name}
                                                                className="w-4 h-3 rounded flex-shrink-0"
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
                        <div className="flex flex-col space-y-2 w-full sm:max-w-[200px]">
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
                                <PopoverContent className="w-full sm:w-[200px] p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="all"
                                                    onSelect={() => handleTypeFilter('all')}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedType === "all" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    All Types
                                                </CommandItem>
                                                <CommandItem
                                                    value="direct"
                                                    onSelect={() => handleTypeFilter('direct')}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedType === "direct" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    Direct
                                                </CommandItem>
                                                <CommandItem
                                                    value="indirect"
                                                    onSelect={() => handleTypeFilter('indirect')}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedType === "indirect" ? "opacity-100" : "opacity-0"
                                                        )}
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

                    {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Total Institutions</p>
                                        <p className="text-xl sm:text-2xl font-semibold">{institutions.total}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Active</p>
                                        <p className="text-xl sm:text-2xl font-semibold">
                                            {institutions.data.filter(inst => inst.is_active).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Direct</p>
                                        <p className="text-xl sm:text-2xl font-semibold">
                                            {institutions.data.filter(inst => inst.institute_type === 'direct').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Globe className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Indirect</p>
                                        <p className="text-xl sm:text-2xl font-semibold">
                                            {institutions.data.filter(inst => inst.institute_type === 'indirect').length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Skeleton className="w-8 h-6 rounded" />
                                        <Skeleton className="w-32 h-6 rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="w-full h-4 rounded" />
                                        <Skeleton className="w-3/4 h-4 rounded" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Institutions Grid */}
                {!isLoading && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {institutions.data.map((institution) => (
                            <Card key={institution.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between min-w-0">
                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{institution.institution_name}</CardTitle>
                                                <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                                                    <StatusSwitch
                                                        id={institution.id}
                                                        checked={institution.is_active}
                                                        route={route('agents:institutions:index', institution.id)}
                                                        showLabel={false}
                                                    />
                                                    <Badge variant={institution.is_active ? "default" : "neutral"} className="text-xs">
                                                        {institution.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <Badge variant="default" className="text-xs">
                                                        {institution.institute_type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Country and Currency */}
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Globe className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">
                                            {institution.rep_country?.country?.name || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">
                                            {institution.currency?.code || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Quality Badge */}
                                    <div className="flex items-center space-x-2">
                                        <Badge className={cn("text-xs", getQualityColor(institution.quality_of_desired_application))}>
                                            {getQualityLabel(institution.quality_of_desired_application)}
                                        </Badge>
                                    </div>

                                    {/* Contact Info */}
                                    {institution.contact_person_name && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{institution.contact_person_name}</span>
                                        </div>
                                    )}

                                    {institution.contact_person_email && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{institution.contact_person_email}</span>
                                        </div>
                                    )}

                                    {institution.contact_person_mobile && (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Phone className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{institution.contact_person_mobile}</span>
                                        </div>
                                    )}

                                    {/* Created Date */}
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">Added: {(() => {
                                            if (!institution.created_at) return 'N/A';
                                            const dateStr = institution.created_at.split('T')[0];
                                            const [y, m, d] = dateStr.split('-');
                                            return `${d}-${m}-${y}`;
                                        })()}</span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
                                        <Link href={route('agents:institutions:index', institution.id)}>
                                            <Button variant="noShadow" size="sm" className="text-xs h-7 px-2">
                                                <Edit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link href={route('agents:institutions:index', institution.id)}>
                                            <Button variant="noShadow" size="sm" className="text-xs h-7 px-2">
                                                <FileText className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Additional Details (Expandable) */}
                                    {(institution.campus || institution.website || institution.monthly_living_cost) && (
                                        <div className="pt-2 border-t">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-muted-foreground">Details:</p>
                                                <Button
                                                    variant="noShadow"
                                                    size="sm"
                                                    className="text-xs h-6 px-2"
                                                    onClick={() => toggleCardExpansion(institution.id)}
                                                >
                                                    {expandedCards[institution.id] ? (
                                                        <>
                                                            <ChevronUp className="w-3 h-3" />
                                                            Show Less
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-3 h-3" />
                                                            View Details
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                            {expandedCards[institution.id] && (
                                                <div className="space-y-1">
                                                    {institution.campus && (
                                                        <div className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Campus:</span> {institution.campus}
                                                        </div>
                                                    )}
                                                    {institution.website && (
                                                        <div className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Website:</span> {institution.website}
                                                        </div>
                                                    )}
                                                    {institution.monthly_living_cost && (
                                                        <div className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Monthly Cost:</span> {institution.currency?.symbol}{institution.monthly_living_cost}
                                                        </div>
                                                    )}
                                                    {institution.application_fee && (
                                                        <div className="text-xs text-muted-foreground">
                                                            <span className="font-medium">Application Fee:</span> {institution.currency?.symbol}{institution.application_fee}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && institutions.data.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No institutions found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by adding your first educational institution
                            </p>
                            <Link href={route('agents:institutions:create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Institution
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {!isLoading && institutions.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                        <div className="text-sm text-muted-foreground text-center sm:text-left">
                            Showing {institutions.from} to {institutions.to} of {institutions.total} results
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button
                                variant="noShadow"
                                size="sm"
                                onClick={() => router.visit(`${route('agents:institutions:index')}?page=${institutions.current_page - 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`)}
                                disabled={institutions.current_page <= 1}
                                className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center space-x-1">
                                {getPageNumbers(institutions.current_page, institutions.last_page).map((page, index) => (
                                    <div key={index}>
                                        {typeof page === 'string' ? (
                                            <span className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">...</span>
                                        ) : (
                                            <Button
                                                variant={page === institutions.current_page ? "default" : "noShadow"}
                                                size="sm"
                                                onClick={() => router.visit(`${route('agents:institutions:index')}?page=${page}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 p-0 hidden sm:flex text-xs sm:text-sm"
                                            >
                                                {page}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="noShadow"
                                size="sm"
                                onClick={() => router.visit(`${route('agents:institutions:index')}?page=${institutions.current_page + 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}${selectedType !== 'all' ? `&type=${selectedType}` : ''}`)}
                                disabled={institutions.current_page >= institutions.last_page}
                                className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
