import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { BranchResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Building2, Check, Clock, Search, RotateCcw, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface Props {
  branches: BranchResource;
  branchesTotal: number;
  branchesActive: number;
  countries?: { id: string; name: string; flag?: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Branches', href: '/agents/branches' },
];

export default function BranchesIndex({ branches, branchesTotal, branchesActive, countries = [] }: Props) {
    const {flash} = usePage<SharedData>().props;
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [initialFilters, setInitialFilters] = useState({
        status: 'all',
        country: 'all',
        keyword: '',
        email: '',
    });

useEffect(() => {
    if (flash?.success) {
        toast.success(flash.success);
    }
}, [flash]);

useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status') || 'all';
    const countryId = urlParams.get('country_id') || 'all';
    const kw = urlParams.get('keyword') || '';
    const email = urlParams.get('contact_person_email') || '';

    setSelectedStatus(status);
    setSelectedCountry(countryId);
    setKeyword(kw);
    setContactEmail(email);
    setInitialFilters({
        status,
        country: countryId,
        keyword: kw,
        email,
    });
}, []);

const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    router.visit(url.toString(), { preserveState: true, preserveScroll: true });
};

const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setStatusOpen(false);
};

const handleCountryFilter = (countryId: string) => {
    setSelectedCountry(countryId);
    setCountryOpen(false);
};

const handleSearch = () => {
    const url = new URL(window.location.href);
    if (selectedStatus && selectedStatus !== 'all') url.searchParams.set('status', selectedStatus);
    else url.searchParams.delete('status');
    if (selectedCountry && selectedCountry !== 'all') url.searchParams.set('country_id', selectedCountry);
    else url.searchParams.delete('country_id');
    if (keyword) url.searchParams.set('keyword', keyword);
    else url.searchParams.delete('keyword');
    if (contactEmail) url.searchParams.set('contact_person_email', contactEmail);
    else url.searchParams.delete('contact_person_email');
    url.searchParams.delete('page');
    setIsLoading(true);
    router.visit(url.toString(), {
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
    });
};

const handleReset = () => {
    setKeyword('');
    setContactEmail('');
    setSelectedStatus('all');
    setSelectedCountry('all');
    setIsLoading(true);
    const url = new URL(window.location.href);
    url.searchParams.delete('keyword');
    url.searchParams.delete('contact_person_email');
    url.searchParams.delete('status');
    url.searchParams.delete('country_id');
    router.visit(url.toString(), {
        onFinish: () => setIsLoading(false),
        onError: () => setIsLoading(false),
    });
};

const getSelectedStatusName = () => {
    if (selectedStatus === 'all') return 'All Status';
    return selectedStatus === 'active' ? 'Active' : 'Inactive';
};

const getSelectedCountryName = () => {
    if (selectedCountry === 'all') return 'All Countries';
    const country = countries.find((c) => c.id === selectedCountry);
    return country ? country.name : 'All Countries';
};

const hasFilterChanges = () => {
    return selectedStatus !== initialFilters.status ||
           selectedCountry !== initialFilters.country ||
           keyword !== initialFilters.keyword ||
           contactEmail !== initialFilters.email;
};

const hasActiveFilters = () => {
    return selectedStatus !== 'all' ||
           selectedCountry !== 'all' ||
           keyword !== '' ||
           contactEmail !== '';
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Branches" />
      <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Heading title="Branches" description="Manage your branches and their contacts" />
          </div>
          <Link href={route('agents:branches:create')} className="w-full sm:w-auto">
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </Link>
        </div>

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
                                    <CommandItem value="all" onSelect={() => handleStatusFilter('all')}>
                                        <Check className={cn('mr-2 h-4 w-4', selectedStatus === 'all' ? 'opacity-100' : 'opacity-0')} />
                                        All Status
                                    </CommandItem>
                                    <CommandItem value="active" onSelect={() => handleStatusFilter('active')}>
                                        <Check className={cn('mr-2 h-4 w-4', selectedStatus === 'active' ? 'opacity-100' : 'opacity-0')} />
                                        Active
                                    </CommandItem>
                                    <CommandItem value="inactive" onSelect={() => handleStatusFilter('inactive')}>
                                        <Check className={cn('mr-2 h-4 w-4', selectedStatus === 'inactive' ? 'opacity-100' : 'opacity-0')} />
                                        Inactive
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Country Filter */}
            <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
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
                                        src={countries.find((c) => c.id === selectedCountry)?.flag}
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
                                    {countries.map((country) => (
                                        <CommandItem
                                            key={country.id}
                                            value={country.name}
                                            onSelect={() => handleCountryFilter(country.id)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selectedCountry === country.id ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                            <div className="flex min-w-0 items-center space-x-2">
                                                {country.flag && (
                                                    <img
                                                        src={country.flag}
                                                        alt={country.name}
                                                        className="h-3 w-4 flex-shrink-0 rounded"
                                                    />
                                                )}
                                                <span className="truncate">{country.name}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
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
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search branches..."
                />
            </div>

            {/* Contact Email Filter */}
            <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
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
            icon={<Building2 className="h-4 w-4 text-blue-600" aria-label="Total branches icon" />}
            label="Total Branches"
            value={branchesTotal}
            bgColor="bg-blue-100"
            iconAriaLabel="Total branches icon"
          />
          <StatsCard
            icon={<Check className="h-4 w-4 text-green-600" aria-label="Active branches icon" />}
            label="Active"
            value={branchesActive}
            bgColor="bg-green-100"
            iconAriaLabel="Active branches icon"
          />
        </div>

        {/* Branches Grid */}
        {branches.data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.data.map((branch) => (
              <Card key={branch.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  {/* Branch Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{branch.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Added {format(new Date(branch.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <StatusSwitch
                      id={branch.id}
                      checked={branch.is_active}
                      route={route('agents:branches:toggle-status', { branch: branch.id })}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Contact Person:</span>
                      <span className="font-medium">{branch.contact_person_name || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium truncate max-w-[120px]" title={branch.contact_person_email}>
                        {branch.contact_person_email || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="font-medium">{branch.contact_person_mobile || 'Not specified'}</span>
                    </div>
                    {branch.user?.last_login_at && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last Login:
                        </span>
                        <span className="font-medium">{format(new Date(branch.user.last_login_at), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-end">
                      <Link href={route('agents:branches:edit', { branch: branch.id })}>
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
        {branches.data.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                <Building2 className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No branches found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first branch</p>
              <Link href={route('agents:branches:create')}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Branch
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {branches.meta && branches.meta.last_page > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  size="default"
                  onClick={() => handlePageChange(branches.meta.current_page - 1)}
                />
              </PaginationItem>
              {Array.from({ length: branches.meta.last_page }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  {typeof page === 'string' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      className="cursor-pointer"
                      size="default"
                      onClick={() => handlePageChange(page)}
                      isActive={page === branches.meta.current_page}
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
                  onClick={() => handlePageChange(branches.meta.current_page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  );
}
