import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { ProcessingOfficeResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Building2, Check, Search, RotateCcw, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';

interface Props {
  processingOffices: ProcessingOfficeResource;
  processingOfficesTotal: number;
  processingOfficesActive: number;
  countries?: { id: string; name: string; flag?: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Processing Offices', href: '/agents/processing-offices' },
];

export default function ProcessingOfficesIndex({ processingOffices, processingOfficesTotal, processingOfficesActive, countries = [] }: Props) {
  const { flash } = usePage<SharedData>().props;
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [initialFilters, setInitialFilters] = useState({
    status: 'all',
    country: 'all',
    keyword: '',
    contactPersonName: '',
    email: '',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status') || 'all';
    const countryId = urlParams.get('country_id') || 'all';
    const kw = urlParams.get('keyword') || '';
    const contactName = urlParams.get('contact_person_name') || '';
    const email = urlParams.get('contact_person_email') || '';

    setSelectedStatus(status);
    setSelectedCountry(countryId);
    setKeyword(kw);
    setContactPersonName(contactName);
    setContactEmail(email);
    setInitialFilters({
      status,
      country: countryId,
      keyword: kw,
      contactPersonName: contactName,
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
    if (contactPersonName) url.searchParams.set('contact_person_name', contactPersonName);
    else url.searchParams.delete('contact_person_name');
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
    setContactPersonName('');
    setContactEmail('');
    setSelectedStatus('all');
    setSelectedCountry('all');
    setIsLoading(true);
    const url = new URL(window.location.href);
    url.searchParams.delete('keyword');
    url.searchParams.delete('contact_person_name');
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
           contactPersonName !== initialFilters.contactPersonName ||
           contactEmail !== initialFilters.email;
  };

  const hasActiveFilters = () => {
    return selectedStatus !== 'all' ||
           selectedCountry !== 'all' ||
           keyword !== '' ||
           contactPersonName !== '' ||
           contactEmail !== '';
  };
  useEffect(() => {
    if (flash?.success) {
      // Show flash message if available
      toast.success(flash?.success);
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Processing Offices" />
      <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Heading title="Processing Offices" description="Manage your processing offices and their contacts" />
          </div>
          <Link href={route('agents:processing-offices:create')} className="w-full sm:w-auto">
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Processing Office
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

          {/* Contact Person Name Filter */}
          <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
            <Label htmlFor="contact_person_name" className="text-sm font-medium">
              Contact Person
            </Label>
            <Input
              id="contact_person_name"
              type="text"
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
              placeholder="Search by contact person..."
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
              placeholder="Search processing offices..."
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
            icon={<Building2 className="h-4 w-4 text-blue-600" aria-label="Total processing offices icon" />}
            label="Total Processing Offices"
            value={processingOfficesTotal}
            bgColor="bg-blue-100"
            iconAriaLabel="Total processing offices icon"
          />
          <StatsCard
            icon={<Check className="h-4 w-4 text-green-600" aria-label="Active processing offices icon" />}
            label="Active Processing Offices"
            value={processingOfficesActive}
            bgColor="bg-green-100"
            iconAriaLabel="Active processing offices icon"
          />
        </div>

        {/* Processing Offices List */}
        <div className="space-y-4">
          {processingOffices.data.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No processing offices found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {hasActiveFilters()
                    ? 'Try adjusting your filters to see more results.'
                    : 'Get started by creating your first processing office.'}
                </p>
                {!hasActiveFilters() && (
                  <Link href={route('agents:processing-offices:create')}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Processing Office
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {processingOffices.data.map((processingOffice) => (
                  <Card key={processingOffice.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      {/* Processing Office Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{processingOffice.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              Added {format(new Date(processingOffice.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <StatusSwitch
                          id={processingOffice.id}
                          checked={processingOffice.is_active}
                          route={route('agents:processing-offices:toggle-status', { processingOffice: processingOffice.id })}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Contact:</span>
                          <span>{processingOffice.contact_person_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Email:</span>
                          <span className="text-muted-foreground">{processingOffice.contact_person_email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Mobile:</span>
                          <span className="text-muted-foreground">{processingOffice.contact_person_mobile}</span>
                        </div>
                      </div>

                      {/* Location Information */}
                      <div className="space-y-1 mb-4">
                        {processingOffice.address && (
                          <p className="text-xs text-muted-foreground">{processingOffice.address}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {[processingOffice.city, processingOffice.state, processingOffice.country?.name]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-1 mb-4">
                        {processingOffice.phone && (
                          <p className="text-xs text-muted-foreground">Phone: {processingOffice.phone}</p>
                        )}
                        {processingOffice.email && (
                          <p className="text-xs text-muted-foreground">Email: {processingOffice.email}</p>
                        )}
                        {processingOffice.website && (
                          <p className="text-xs text-muted-foreground">Website: {processingOffice.website}</p>
                        )}
                        {processingOffice.whatsapp && (
                          <p className="text-xs text-muted-foreground">WhatsApp: {processingOffice.whatsapp}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {/* Primary Actions */}
                        <div className="flex gap-2">
                          <Link href={route('agents:processing-offices:edit', { processingOffice: processingOffice.id })}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Link href={route('agents:processing-offices:assign-institutions', { processingOffice: processingOffice.id })}>
                            <Button size="sm" variant="outline">
                              <Building2 className="h-3 w-3 mr-1" />
                              Assign Institutions
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {processingOffices.meta.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {processingOffices.meta.current_page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(processingOffices.meta.current_page - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {Array.from({ length: processingOffices.meta.last_page }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === processingOffices.meta.last_page ||
                          (page >= processingOffices.meta.current_page - 1 && page <= processingOffices.meta.current_page + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                                isActive={page === processingOffices.meta.current_page}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === processingOffices.meta.current_page - 2 ||
                          page === processingOffices.meta.current_page + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      {processingOffices.meta.current_page < processingOffices.meta.last_page && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(processingOffices.meta.current_page + 1);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
