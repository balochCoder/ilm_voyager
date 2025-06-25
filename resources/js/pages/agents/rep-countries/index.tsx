import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country, PaginationData, RepCountry, SharedData, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccordionItem } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Minus, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useAddStatusSheet } from '@/hooks/useAddStatusSheet';

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

export default function RepCountriesIndex({ repCountries, availableCountries, statuses, pagination }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>(() => {
        // Initialize with the current active states from props
        const initialStates: { [key: string]: boolean } = {};
        repCountries.forEach(country => {
            initialStates[country.id] = country.is_active;
        });
        return initialStates;
    });

    // Use the custom hook for add status sheet
    const addStatusSheet = useAddStatusSheet();

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

    const toggleActiveStatus = (countryId: string) => {
        const newActiveState = !activeStates[countryId];

        // Optimistically update the UI
        setActiveStates(prev => ({
            ...prev,
            [countryId]: newActiveState
        }));

        // Use Inertia router to send the request
        router.patch(route('agents:rep-countries:toggle-status', countryId), {
            is_active: newActiveState
        }, {
            onError: (errors) => {
                // Revert the optimistic update if the request fails
                setActiveStates(prev => ({
                    ...prev,
                    [countryId]: !newActiveState
                }));
                console.error('Error updating country status:', errors);
            }

        });
    };

    // Helper function to generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const current = pagination.current_page;
        const last = pagination.last_page;

        // Always show first page
        pages.push(1);

        if (current > 3) {
            pages.push('...');
        }

        // Show pages around current page
        for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
            if (i !== 1 && i !== last) {
                pages.push(i);
            }
        }

        if (current < last - 2) {
            pages.push('...');
        }

        // Always show last page if there's more than one page
        if (last > 1) {
            pages.push(last);
        }

        return pages;
    };

    // Get the selected country name for display
    const getSelectedCountryName = () => {
        if (selectedCountry === 'all') return 'All Countries';
        const country = availableCountries.find(c => c.id === selectedCountry);
        return country ? country.name : 'All Countries';
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Representing Countries" />

            <div className="flex h-full flex-1 flex-col p-4">
                <div className="flex justify-between items-center">
                    <Heading title='Representing Countries' />
                    <Link href={route('agents:rep-countries:create')} prefetch>
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
                                            <span className="text-sm text-black">
                                                {activeStates[repCountry.id] ? 'Active' : 'Inactive'}
                                            </span>
                                            <Switch
                                                checked={activeStates[repCountry.id]}
                                                onCheckedChange={() => toggleActiveStatus(repCountry.id)}
                                                className="data-[state=checked]:bg-blue-500"
                                            />
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
                                                onClick={() => addStatusSheet.openSheet(repCountry.id, repCountry.country.name)}
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
                                                        {(repCountry.statuses ?? []).map((status: Status, index: number) => {
                                                            return (
                                                                <TableRow key={status.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{`Status ${status.pivot?.order}`}</TableCell>
                                                                    <TableCell className="font-medium">{status.name}</TableCell>
                                                                    <TableCell>{/* Actions will be added later */}</TableCell>
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

                                    {getPageNumbers().map((page, index) => (
                                        <PaginationItem key={index}>
                                            {page === '...' ? (
                                                <PaginationEllipsis />
                                            ) : (
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

                {/* Single Add Status Sheet */}
                <Sheet open={addStatusSheet.isOpen} onOpenChange={addStatusSheet.closeSheet}>
                    <SheetContent side="right">
                        <SheetHeader>
                            <SheetTitle>Add a Status for {addStatusSheet.currentRepCountryName}</SheetTitle>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="status-name">Status Name</Label>
                                <Input
                                    ref={addStatusSheet.inputRef}
                                    value={addStatusSheet.newStatusName}
                                    onChange={(e) => addStatusSheet.setNewStatusName(e.target.value)}
                                    placeholder="Status name"
                                    disabled={addStatusSheet.isAdding}
                                    autoFocus
                                    id='status-name'
                                />
                            </div>
                        </div>



                        <SheetFooter>
                            <Button type="submit" disabled={addStatusSheet.isAdding || !addStatusSheet.newStatusName.trim()} onClick={addStatusSheet.handleAddStatus} className="w-full">
                                {addStatusSheet.isAdding ? 'Adding...' : 'Add Status'}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="neutral">Close</Button>
                            </SheetClose>
                        </SheetFooter>

                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
