import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country, PaginationData, RepCountry, RepCountryStatus, SharedData, Status, SubStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Check, ChevronsUpDown, Loader2, Loader, Edit, Settings, Calendar, FileText, ArrowUpDown, ChevronDown, ChevronUp, Layers } from 'lucide-react';
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
import { useAddStatusDialog } from '@/hooks/useAddStatusDialog';
import { useEditStatusDialog } from '@/hooks/useEditStatusDialog';
import { useSwitchState } from '@/hooks/useSwitchState';
import { useSubStatusActions } from '@/hooks/useSubStatusActions';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from '@/components/ui/sheet';

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
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
    const [subStatusDialog, setSubStatusDialog] = useState<{
        isOpen: boolean;
        statusId: string;
        statusName: string;
        newSubStatusName: string;
        isAdding: boolean;
        errors: { name?: string };
    }>({
        isOpen: false,
        statusId: '',
        statusName: '',
        newSubStatusName: '',
        isAdding: false,
        errors: {}
    });
    const [subStatusesSheet, setSubStatusesSheet] = useState<{
        isOpen: boolean;
        status: RepCountryStatus | null;
    }>({
        isOpen: false,
        status: null
    });
    const [sheetTitle, setSheetTitle] = useState<string>('');

    // Use the custom hook for add status sheet
    const addStatusDialog = useAddStatusDialog();
    // Use the custom hook for edit status dialog
    const editStatusDialog = useEditStatusDialog();
    // Use the custom hook for switch states
    const { isSwitchLoading } = useSwitchState();
    // Use the custom hook for sub-status actions
    const subStatusActions = useSubStatusActions();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        }
    }, [flash]);

    // Refresh sheet content when sub-statuses are updated
    useEffect(() => {
        if (subStatusesSheet.isOpen && subStatusesSheet.status) {
            refreshSubStatusesInSheet();
        }
    }, [repCountries]);

    // Refresh sheet content after successful sub-status operations
    useEffect(() => {
        if (subStatusesSheet.isOpen && !subStatusActions.editDialog.isOpen && !subStatusDialog.isOpen) {
            refreshSubStatusesInSheet();
        }
    }, [subStatusActions.editDialog.isOpen, subStatusDialog.isOpen]);

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

    const toggleCardExpansion = (countryId: string) => {
        setExpandedCards(prev => ({
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

    const handleAddSubStatus = (statusId: string, statusName: string) => {
        setSubStatusDialog({
            isOpen: true,
            statusId,
            statusName,
            newSubStatusName: '',
            isAdding: false,
            errors: {}
        });
    };

    const handleAddSubStatusSubmit = async () => {
        if (!subStatusDialog.newSubStatusName.trim()) {
            setSubStatusDialog(prev => ({
                ...prev,
                errors: { name: 'Sub-step name is required' }
            }));
            return;
        }

        setSubStatusDialog(prev => ({ ...prev, isAdding: true, errors: {} }));

        try {
            router.post(route('agents:rep-countries:add-sub-status', { repCountryStatus: subStatusDialog.statusId }), {
                name: subStatusDialog.newSubStatusName
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSubStatusDialog(prev => ({ ...prev, isOpen: false }));
                },
                onError: (errors) => {
                    setSubStatusDialog(prev => ({
                        ...prev,
                        errors: errors
                    }));
                },
                onFinish: () => {
                    setSubStatusDialog(prev => ({ ...prev, isAdding: false }));
                }
            });
        } catch (e) {
            setSubStatusDialog(prev => ({
                ...prev,
                errors: { name: 'An error occurred while adding sub-step' }
            }));
            setSubStatusDialog(prev => ({ ...prev, isAdding: false }));
            console.log(e);

        }
    };

    const closeSubStatusDialog = () => {
        setSubStatusDialog(prev => ({ ...prev, isOpen: false }));
    };

    const openSubStatusesSheet = (status: RepCountryStatus) => {
        setSheetTitle(`Sub-Steps for "${status.status_name}"`);
        setSubStatusesSheet({
            isOpen: true,
            status
        });
    };


    const handleSheetOpenChange = (open: boolean) => {
        if (!open) {
            // Add a small delay to allow the sheet to close smoothly
            setTimeout(() => {
                setSubStatusesSheet({
                    isOpen: false,
                    status: null
                });
                // Keep the title for a bit longer to prevent flickering
                setTimeout(() => {
                    setSheetTitle('');
                }, 300);
            }, 150);
        } else {
            setSubStatusesSheet(prev => ({ ...prev, isOpen: true }));
        }
    };

    const handleAddSubStatusFromSheet = (statusId: string, statusName: string) => {
        // Close the sheet first
        setSubStatusesSheet({
            isOpen: false,
            status: null
        });

        // Then open the dialog after a short delay
        setTimeout(() => {
            handleAddSubStatus(statusId, statusName);
        }, 200);
    };

    const refreshSubStatusesInSheet = () => {
        if (subStatusesSheet.status) {
            // Find the updated status from the repCountries data
            const updatedStatus = repCountries
                .flatMap(rc => rc.statuses || [])
                .find(s => s.id === subStatusesSheet.status?.id);

            if (updatedStatus) {
                setSubStatusesSheet(prev => ({
                    ...prev,
                    status: updatedStatus
                }));
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Representing Countries" />

            <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-6 overflow-x-hidden">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <Heading title='Representing Countries' />
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Manage countries you represent and their application processes
                        </p>
                    </div>
                    <Link href={route('agents:rep-countries:create')} className="w-full sm:w-auto">
                        <Button className='cursor-pointer w-full'>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Country
                        </Button>
                    </Link>
                </div>

                {/* Stats and Filter Section */}
                <div className="flex flex-col gap-6">
                    {/* Country Filter */}
                    <div className="flex flex-col space-y-2 w-full sm:max-w-[280px]">
                        <Label htmlFor="country-filter" className="text-sm font-medium">
                            Filter by Country
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="noShadow"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <div className="flex items-center space-x-2 min-w-0">
                                        {selectedCountry !== 'all' && (
                                            <img
                                                src={availableCountries.find(c => c.id === selectedCountry)?.flag}
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
                                                    <div className="flex items-center space-x-2 min-w-0">
                                                        <img
                                                            src={country.flag}
                                                            alt={country.name}
                                                            className="w-4 h-3 rounded flex-shrink-0"
                                                        />
                                                        <span className="truncate">{country.name}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Settings className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-muted-foreground">Total Countries</p>
                                        <p className="text-xl sm:text-2xl font-semibold">{pagination.total}</p>
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
                                            {repCountries.filter(rc => rc.is_active).length}
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

                {/* Countries Grid */}
                {!isLoading && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {repCountries.map((repCountry) => (
                            <Card key={repCountry.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between min-w-0">
                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                            <img
                                                src={repCountry.country.flag}
                                                alt={repCountry.country.name}
                                                className="w-6 h-4 sm:w-8 sm:h-6 rounded shadow-sm flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{repCountry.country.name}</CardTitle>
                                                <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                                                    {isSwitchLoading(repCountry.id) ? (
                                                        <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500" />
                                                    ) : (
                                                        <StatusSwitch
                                                            id={repCountry.id}
                                                            checked={repCountry.is_active}
                                                            route={route('agents:rep-countries:toggle-status', repCountry.id)}
                                                            showLabel={false}
                                                        />
                                                    )}
                                                    <Badge variant={repCountry.is_active ? "default" : "neutral"} className="text-xs">
                                                        {repCountry.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Status Count */}
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{repCountry.statuses?.length || 0} application steps</span>
                                    </div>

                                    {/* Created Date */}
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">Added: {(() => {
                                            const dateStr = repCountry.created?.string?.split('T')[0] || '';
                                            if (!dateStr) return 'N/A';
                                            const [y, m, d] = dateStr.split('-');
                                            return `${d}-${m}-${y}`;
                                        })()}</span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
                                        <Link href={route('agents:rep-countries:add-notes', repCountry.id)}>
                                            <Button variant="noShadow" size="sm" className="text-xs h-7 px-2">
                                                Notes
                                            </Button>
                                        </Link>
                                        <Link href={route('agents:rep-countries:reorder-statuses', repCountry.id)}>
                                            <Button variant="noShadow" size="sm" className="text-xs h-7 px-2">
                                                <ArrowUpDown className="w-3 h-3 mr-1" />
                                                Reorder
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => addStatusDialog.openDialog(repCountry.id, repCountry.country.name)}
                                            variant="noShadow"
                                            size="sm"
                                            className="text-xs h-7 px-2"
                                        >
                                            Add Step
                                        </Button>
                                    </div>

                                    {/* Status Preview */}
                                    {repCountry.statuses && repCountry.statuses.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-muted-foreground">Application Steps:</p>
                                                {repCountry.statuses.length > 3 && (
                                                    <Button
                                                        variant="noShadow"
                                                        size="sm"
                                                        className="text-xs h-6 px-2"
                                                        onClick={() => toggleCardExpansion(repCountry.id)}
                                                    >
                                                        {expandedCards[repCountry.id] ? (
                                                            <>
                                                                <ChevronUp className="w-3 h-3" />
                                                                Show Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-3 h-3" />
                                                                View All ({repCountry.statuses.length})
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                {(expandedCards[repCountry.id] ? repCountry.statuses : repCountry.statuses.slice(0, 3)).map((status: RepCountryStatus, index: number) => (
                                                    <div key={status.id} className="flex items-center justify-between text-xs min-w-0">
                                                        <span className="text-muted-foreground truncate flex-1 mr-2 min-w-0">
                                                            {index + 1}. {status.status_name}
                                                        </span>
                                                        {status.status_name !== 'New' && (
                                                            <div className="flex items-center space-x-1 flex-shrink-0">
                                                                {isSwitchLoading(status.id) ? (
                                                                    <Loader className="w-3 h-3 animate-spin text-blue-500" />
                                                                ) : (
                                                                    <StatusSwitch
                                                                        id={status.id}
                                                                        checked={status.is_active || false}
                                                                        route={route('agents:rep-countries:toggle-rep-country-status', status.id)}
                                                                        showLabel={false}
                                                                    />
                                                                )}
                                                                <Button
                                                                    onClick={() => editStatusDialog.openDialog(status)}
                                                                    variant="noShadow"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0 flex-shrink-0"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleAddSubStatus(status.id, status.status_name)}
                                                                    variant="noShadow"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0 flex-shrink-0"
                                                                    title="Add sub-step"
                                                                >
                                                                    <Layers className="w-3 h-3" />
                                                                </Button>
                                                                {status.sub_statuses && status.sub_statuses.length > 0 && (
                                                                    <Button
                                                                        onClick={() => openSubStatusesSheet(status)}
                                                                        variant="noShadow"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 flex-shrink-0"
                                                                        title="View sub-steps"
                                                                    >
                                                                        <FileText className="w-3 h-3" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {!expandedCards[repCountry.id] && repCountry.statuses.length > 3 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        +{repCountry.statuses.length - 3} more steps
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && repCountries.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Settings className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No countries found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by adding your first representing country
                            </p>
                            <Link href={route('agents:rep-countries:create')}>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Country
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {!isLoading && pagination.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                        <div className="text-sm text-muted-foreground text-center sm:text-left">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} results
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button
                                variant="noShadow"
                                size="sm"
                                onClick={() => router.visit(`${route('agents:rep-countries:index')}?page=${pagination.current_page - 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`)}
                                disabled={pagination.current_page <= 1}
                                className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                            >
                                Previous
                            </Button>
                            <div className="flex items-center space-x-1">
                                {getPageNumbers(pagination.current_page, pagination.last_page).map((page, index) => (
                                    <div key={index}>
                                        {typeof page === 'string' ? (
                                            <span className="px-1 sm:px-2 text-muted-foreground text-xs sm:text-sm">...</span>
                                        ) : (
                                            <Button
                                                variant={page === pagination.current_page ? "default" : "noShadow"}
                                                size="sm"
                                                onClick={() => router.visit(`${route('agents:rep-countries:index')}?page=${page}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 p-0 hidden sm:flex text-xs sm:text-sm"
                                            >
                                                {page}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {/* Mobile page indicator */}
                                <div className="sm:hidden text-xs text-muted-foreground px-1">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </div>
                            </div>
                            <Button
                                variant="noShadow"
                                size="sm"
                                onClick={() => router.visit(`${route('agents:rep-countries:index')}?page=${pagination.current_page + 1}${selectedCountry !== 'all' ? `&country_id=${selectedCountry}` : ''}`)}
                                disabled={!pagination.has_more_pages}
                                className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Add Status Dialog */}
                <Dialog open={addStatusDialog.isOpen} onOpenChange={addStatusDialog.closeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Application Step for {addStatusDialog.currentRepCountryName}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="status-name">Step Name</Label>
                                <Input
                                    id="status-name"
                                    value={addStatusDialog.newStatusName}
                                    onChange={e => addStatusDialog.setNewStatusName(e.target.value)}
                                    placeholder="e.g., Document Review, Interview, Approval"
                                    disabled={addStatusDialog.isAdding}
                                    autoFocus
                                />
                                {addStatusDialog.errors.name && (
                                    <p className="text-sm text-red-600">{addStatusDialog.errors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={addStatusDialog.isAdding || !addStatusDialog.newStatusName.trim()} onClick={addStatusDialog.handleAddStatus} >
                                {addStatusDialog.isAdding ? 'Adding...' : 'Add Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="neutral">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Status Dialog */}
                <Dialog open={editStatusDialog.isOpen} onOpenChange={editStatusDialog.closeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Application Step</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="edit-status-name">Step Name</Label>
                                <Input
                                    id="edit-status-name"
                                    value={editStatusDialog.editedStatusName}
                                    onChange={e => editStatusDialog.setEditedStatusName(e.target.value)}
                                    placeholder="Step name"
                                    disabled={editStatusDialog.isEditing}
                                    autoFocus
                                />
                                {editStatusDialog.errors.status_name && (
                                    <p className="text-sm text-red-600">{editStatusDialog.errors.status_name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={editStatusDialog.isEditing || !editStatusDialog.editedStatusName.trim()} onClick={editStatusDialog.handleEditStatus} >
                                {editStatusDialog.isEditing ? 'Updating...' : 'Update Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="neutral">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Sub-Status Dialog */}
                <Dialog open={subStatusDialog.isOpen} onOpenChange={closeSubStatusDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Sub-Step to "{subStatusDialog.statusName}"</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="sub-status-name">Sub-Step Name</Label>
                                <Input
                                    id="sub-status-name"
                                    value={subStatusDialog.newSubStatusName}
                                    onChange={e => setSubStatusDialog(prev => ({ ...prev, newSubStatusName: e.target.value }))}
                                    placeholder="e.g., Document Review, Interview, Approval"
                                    disabled={subStatusDialog.isAdding}
                                    autoFocus
                                />
                                {subStatusDialog.errors.name && (
                                    <p className="text-sm text-red-600">{subStatusDialog.errors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={subStatusDialog.isAdding || !subStatusDialog.newSubStatusName.trim()}
                                onClick={handleAddSubStatusSubmit}
                            >
                                {subStatusDialog.isAdding ? 'Adding...' : 'Add Sub-Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="neutral">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Sub-Status Dialog */}
                <Dialog open={subStatusActions.editDialog.isOpen} onOpenChange={subStatusActions.closeEditDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Sub-Step</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="edit-sub-status-name">Sub-Step Name</Label>
                                <Input
                                    id="edit-sub-status-name"
                                    value={subStatusActions.editDialog.editedName}
                                    onChange={e => subStatusActions.setEditedName(e.target.value)}
                                    placeholder="Sub-step name"
                                    disabled={subStatusActions.editDialog.isEditing}
                                    autoFocus
                                />
                                {subStatusActions.editDialog.errors.name && (
                                    <p className="text-sm text-red-600">{subStatusActions.editDialog.errors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={subStatusActions.editDialog.isEditing || !subStatusActions.editDialog.editedName.trim()}
                                onClick={subStatusActions.handleEditSubStatus}
                            >
                                {subStatusActions.editDialog.isEditing ? 'Updating...' : 'Update Sub-Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="neutral">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Sub-Statuses Sheet */}
                <Sheet open={subStatusesSheet.isOpen} onOpenChange={handleSheetOpenChange}>
                    <SheetContent className="w-full sm:w-[400px] lg:w-[540px]">
                        <SheetHeader>
                            <SheetTitle className="text-lg sm:text-xl">{sheetTitle}</SheetTitle>
                            <SheetDescription className="text-sm">
                                Manage the sub-steps for this application step. You can toggle their status and edit their names.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            {!subStatusesSheet.status ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader className="w-6 h-6 animate-spin text-blue-500" />
                                </div>
                            ) : subStatusesSheet.status.sub_statuses && subStatusesSheet.status.sub_statuses.length > 0 ? (
                                <div className="space-y-3">
                                    {subStatusesSheet.status.sub_statuses.map((subStatus: SubStatus, index: number) => (
                                        <div key={subStatus.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-blue-600 flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{subStatus.name}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {subStatus.is_active ? 'Active' : 'Inactive'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                                {subStatusActions.isToggleLoading(subStatus.id) ? (
                                                    <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                                ) : (
                                                    <Switch
                                                        checked={subStatus.is_active || false}
                                                        onCheckedChange={(checked: boolean) => subStatusActions.handleToggleSubStatus(subStatus, checked)}
                                                        className="data-[state=checked]:bg-blue-500"
                                                    />
                                                )}
                                                <Button
                                                    onClick={() => {
                                                        subStatusActions.openEditDialog(subStatus);
                                                        // Refresh sheet content after editing
                                                        setTimeout(() => {
                                                            refreshSubStatusesInSheet();
                                                        }, 100);
                                                    }}
                                                    variant="noShadow"
                                                    size="sm"
                                                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-200"
                                                    title="Edit sub-step"
                                                >
                                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No sub-steps yet</h3>
                                    <p className="text-sm text-gray-500 mb-4 px-4">
                                        Add sub-steps to break down this application step into smaller tasks.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            if (subStatusesSheet.status) {
                                                handleAddSubStatusFromSheet(subStatusesSheet.status.id, subStatusesSheet.status.status_name);
                                            }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                    >
                                        <Layers className="w-4 h-4 mr-2" />
                                        Add First Sub-Step
                                    </Button>
                                </div>
                            )}


                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
