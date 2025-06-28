import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country, PaginationData, RepCountry, RepCountryStatus, SharedData, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccordionItem } from '@/components/ui/accordion';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Minus, Check, ChevronsUpDown, Loader2, Loader } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useAddStatusDialog } from '@/hooks/useAddStatusSheet';
import { useSwitchState } from '@/hooks/useSwitchState';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
    repCountries: RepCountry[];
    availableCountries: Country[];
    statuses: Status[];
    pagination: PaginationData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/agents/dashboard',
    },
    {
        title: 'Representing Countries',
        href: '/agents/representing-countries',
    },
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

export default function RepCountriesIndex({ repCountries, availableCountries, pagination }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Use the custom hook for add status sheet
    const addStatusDialog = useAddStatusDialog();
    // Use the custom hook for switch states
    const { isSwitchLoading } = useSwitchState();

    useEffect(() => {
        // use toast if flash.success
        if (flash?.success) {
            // Show a toast notification or alert with the success message
            toast.success(flash?.success); // Replace with your toast implementation
        }
    }, [flash]);

    // Initialize selected country from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const countryId = urlParams.get('country_id');
        if (countryId) {
            setSelectedCountry(countryId);
        }
    }, []);

    const handleCountryFilter = (countryId: string) => {
        setSelectedCountry(countryId);
        setOpen(false);
        setIsLoading(true);

        // Build the URL with the filter parameter
        const url = new URL(window.location.href);
        if (countryId === 'all') {
            url.searchParams.delete('country_id');
        } else {
            url.searchParams.set('country_id', countryId);
        }
        // Reset to first page when filtering
        url.searchParams.delete('page');

        // Navigate to the filtered results
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const toggleAccordion = (countryId: string) => {
        setOpenAccordions(prev => ({
            ...prev,
            [countryId]: !prev[countryId]
        }));
    };

    // Get the selected country name for display
    const getSelectedCountryName = () => {
        if (selectedCountry === 'all') return 'All Countries';
        const country = availableCountries.find(c => c.id === selectedCountry);
        return country ? country.name : 'All Countries';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Representing Countries" />

            <div className="flex h-full flex-1 flex-col p-4">
                <div className="flex justify-between items-center">
                    <Heading title='Representing Countries' />
                    <Link href={route('agents:rep-countries:create')}>
                        <Button className='cursor-pointer'>
                            <Plus className="w-4 h-4" />
                            Add Representing Country
                        </Button>
                    </Link>
                </div>

                {/* Country Filter Combobox */}
                <div className="flex flex-col">
                    <Label htmlFor="country-filter" className="text-sm font-medium text-gray-700">
                        Filter by Country:
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="noShadow"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-64 justify-between"
                                    disabled={isLoading}
                                >
                                    <div className="flex items-center space-x-2">
                                        {selectedCountry !== 'all' && (
                                            <img
                                                src={availableCountries.find(c => c.id === selectedCountry)?.flag}
                                                alt=""
                                                className="w-4 h-3 rounded"
                                            />
                                        )}
                                        <span>{getSelectedCountryName()}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0">
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
                                            {availableCountries.map((country) => (
                                                <CommandItem
                                                    key={country.id}
                                                    value={country.name}
                                                    onSelect={() => handleCountryFilter(country.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCountry === country.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex items-center space-x-2">
                                                        <img
                                                            src={country.flag}
                                                            alt={country.name}
                                                            className="w-4 h-3 rounded"
                                                        />
                                                        <span>{country.name}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {isLoading && (
                            <Loader2 className="w-4 h-4 rounded animate-spin ml-2" />
                        )}
                    </div>
                    <div className="text-sm text-gray-600 mt-6">
                        Total Representing Countries: {pagination.total}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="border overflow-hidden shadow-sm">
                                {/* Skeleton for Alert */}
                                <div className="border-l-4 border-blue-500 bg-main p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="w-8 h-6 rounded" />
                                            <Skeleton className="w-32 h-6 rounded" />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Skeleton className="w-16 h-4 rounded" />
                                            <Skeleton className="w-10 h-6 rounded" />
                                        </div>
                                    </div>
                                </div>

                                {/* Skeleton for Accordion Trigger */}
                                <div className="flex items-center border-l-4 border-blue-500 justify-between w-full p-4 bg-white">
                                    <Skeleton className="w-48 h-6 rounded" />
                                    <Skeleton className="w-8 h-8 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Content */}
                {!isLoading && (
                    <div className="space-y-4">
                        {repCountries.map((repCountry) => (
                            <div key={repCountry.id} className="border overflow-hidden shadow-sm">
                                {/* Alert with Country Information */}
                                <Alert className="border-l-4 bg-main border-blue-500 rounded-b-none border-b-0 rounded-t-none border-t-0 border-b-transparent">
                                    <AlertDescription className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={repCountry.country.flag}
                                                alt={repCountry.country.name}
                                                className="w-8 h-6 rounded shadow-sm"
                                            />
                                            <span className="font-semibold text-lg text-gray-900">
                                                {repCountry.country.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {!isSwitchLoading(repCountry.id) && (
                                                <span className="text-sm text-black">
                                                    {repCountry.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                            {isSwitchLoading(repCountry.id) ? (
                                                <Loader className="w-5 h-5 mr-5 animate-spin text-blue-500" />
                                            ) : (
                                                <StatusSwitch
                                                    id={repCountry.id}
                                                    checked={repCountry.is_active}
                                                    route={route('agents:rep-countries:toggle-status', repCountry.id)}
                                                    showLabel={false}
                                                />
                                            )}
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                {/* Accordion for Application Process Management */}
                                <AccordionItem className="border-0">
                                    <div className="flex items-center border-l-4 border-blue-500 justify-between w-full p-4 bg-white hover:bg-gray-50 rounded-t-none border-t-0 rounded-b-none border-b-0 shadow-none">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => toggleAccordion(repCountry.id)}
                                                className="text-sm hover:text-gray-900 text-blue-600 transition-colors cursor-pointer"
                                            >
                                                View Application Process
                                            </button>
                                            <span className="mx-1 text-gray-400">|</span>
                                            <span className="text-xs text-gray-500">Country Added: {(() => {
                                                const dateStr = repCountry.created?.string?.split('T')[0] || '';
                                                if (!dateStr) return '';
                                                const [y, m, d] = dateStr.split('-');
                                                return `${d}-${m}-${y}`;
                                            })()}</span>
                                            <span className="mx-1 text-gray-400">|</span>
                                            <Link href={route('agents:rep-countries:add-notes', repCountry.id)} className='text-sm hover:text-gray-900 text-blue-600 transition-colors cursor-pointer'>
                                                Status Notes
                                            </Link>
                                            <span className="mx-1 text-gray-400">|</span>
                                            <Link href={route('agents:rep-countries:reorder-statuses', repCountry.id)} className='text-sm hover:text-gray-900 text-blue-600 transition-colors cursor-pointer'>
                                                Reorder Steps
                                            </Link>
                                            <span className="mx-1 text-gray-400">|</span>
                                            <button
                                                onClick={() => addStatusDialog.openDialog(repCountry.id, repCountry.country.name)}
                                                className='text-sm hover:text-gray-900 text-blue-600 transition-colors cursor-pointer'
                                            >
                                                Add a status
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => toggleAccordion(repCountry.id)}
                                            className="p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            {openAccordions[repCountry.id] ? (
                                                <Minus className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <Plus className="w-4 h-4 text-blue-600" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Accordion Content with Table */}
                                    {openAccordions[repCountry.id] && (
                                        <div className="bg-white border-l-4 border-b-4 border-blue-500">
                                            {/* Application Process Table */}
                                            <div className="overflow-x-auto">
                                                <Table className='border-l-0 border-b-0 border-r-0'>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>S.No</TableHead>
                                                            <TableHead>Steps</TableHead>
                                                            <TableHead>Status Name</TableHead>
                                                            <TableHead>Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {(repCountry.statuses ?? []).map((status: RepCountryStatus, index: number) => {
                                                            return (
                                                                <TableRow key={status.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{`Status ${status.order}`}</TableCell>
                                                                    <TableCell className="font-medium">{status.status_name}</TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center space-x-3">
                                                                            
                                                                            {isSwitchLoading(status.id) ? (
                                                                                <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                                                            ) : (
                                                                                <StatusSwitch
                                                                                    id={status.id}
                                                                                    checked={status.is_active || false}
                                                                                    route={route('agents:rep-countries:toggle-rep-country-status', status.id)}
                                                                                    showLabel={false}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </AccordionItem>
                            </div>
                        ))}

                        {repCountries.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No representing countries found. Create your first one!
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between w-full mt-3">
                        <div className="text-sm text-gray-700 whitespace-nowrap">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} results
                        </div>
                        <div className="flex-shrink-0">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={`${route('agents:rep-countries:index')}?page=${pagination.current_page - 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`}
                                            className={pagination.current_page <= 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {getPageNumbers(pagination.current_page, pagination.last_page).map((page, index) => (
                                        <PaginationItem key={index}>
                                            {typeof page === 'string' ? <PaginationEllipsis /> : (
                                                <PaginationLink
                                                    href={`${route('agents:rep-countries:index')}?page=${page}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`}
                                                    isActive={page === pagination.current_page}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={`${route('agents:rep-countries:index')}?page=${pagination.current_page + 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`}
                                            className={!pagination.has_more_pages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}

                {/* Single Add Status Dialog */}
                <Dialog open={addStatusDialog.isOpen} onOpenChange={addStatusDialog.closeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a Status for {addStatusDialog.currentRepCountryName}</DialogTitle>
                        </DialogHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="status-name">Status Name</Label>
                                <Input
                                    id="status-name"
                                    value={addStatusDialog.newStatusName}
                                    onChange={e => addStatusDialog.setNewStatusName(e.target.value)}
                                    placeholder="Status name"
                                    disabled={addStatusDialog.isAdding}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={addStatusDialog.isAdding || !addStatusDialog.newStatusName.trim()} onClick={addStatusDialog.handleAddStatus} >
                                {addStatusDialog.isAdding ? 'Adding...' : 'Add Status'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="neutral">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
