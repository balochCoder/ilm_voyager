import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Switch } from '@/components/ui/switch';
import { useAddStatusDialog } from '@/hooks/useAddStatusDialog';
import { useEditStatusDialog } from '@/hooks/useEditStatusDialog';
import { useSubStatusActions } from '@/hooks/useSubStatusActions';
import { useSwitchState } from '@/hooks/useSwitchState';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Country, RepCountryResource, RepCountryStatus, SharedData, Status, SubStatus } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    Calendar,
    Check,
    ChevronDown,
    ChevronsUpDown,
    ChevronUp,
    Edit,
    FileText,
    Layers,
    Loader,
    Loader2,
    Plus,
    Settings,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface Props {
    repCountries: RepCountryResource;
    availableCountries: Country[];
    statuses: Status[];
    repCountriesTotal: number;
    repCountriesActive: number;
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

export default function RepCountriesIndex({ repCountries, availableCountries, repCountriesTotal, repCountriesActive }: Props) {
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
        errors: {},
    });
    const [subStatusesSheet, setSubStatusesSheet] = useState<{
        isOpen: boolean;
        status: RepCountryStatus | null;
    }>({
        isOpen: false,
        status: null,
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

    // Move refreshSubStatusesInSheet and its callback above useEffect hooks
    const refreshSubStatusesInSheet = () => {
        if (subStatusesSheet.status) {
            // Find the updated status from the repCountries data
            const updatedStatus = repCountries.data.flatMap((rc) => rc.statuses || []).find((s) => s.id === subStatusesSheet.status?.id);

            if (updatedStatus) {
                setSubStatusesSheet((prev) => ({
                    ...prev,
                    status: updatedStatus,
                }));
            }
        }
    };
    const refreshSubStatusesInSheetCb = useCallback(refreshSubStatusesInSheet, [repCountries, subStatusesSheet.status]);

    // Refresh sheet content when sub-statuses are updated
    useEffect(() => {
        if (subStatusesSheet.isOpen && subStatusesSheet.status) {
            refreshSubStatusesInSheetCb();
        }
    }, [repCountries, subStatusesSheet.isOpen, subStatusesSheet.status, refreshSubStatusesInSheetCb]);

    // Refresh sheet content after successful sub-status operations
    useEffect(() => {
        if (subStatusesSheet.isOpen && !subStatusActions.editDialog.isOpen && !subStatusDialog.isOpen) {
            refreshSubStatusesInSheetCb();
        }
    }, [subStatusesSheet.isOpen, subStatusActions.editDialog.isOpen, subStatusDialog.isOpen, refreshSubStatusesInSheetCb]);

    // Initialize selected country from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const countryId = urlParams.get('country_id');
        if (countryId) {
            setSelectedCountry(countryId);
        }
    }, [setSelectedCountry]);

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
        setExpandedCards((prev) => ({
            ...prev,
            [countryId]: !prev[countryId],
        }));
    };

    // Get the selected country name for display
    const getSelectedCountryName = () => {
        if (selectedCountry === 'all') return 'All Countries';
        const country = availableCountries.find((c) => c.id === selectedCountry);
        return country ? country.name : 'All Countries';
    };

    const handleAddSubStatus = (statusId: string, statusName: string) => {
        setSubStatusDialog({
            isOpen: true,
            statusId,
            statusName,
            newSubStatusName: '',
            isAdding: false,
            errors: {},
        });
    };

    const handlePageChange = (page: number) => {
        const params: Record<string, number> = { page };

        router.get(route('agents:rep-countries:index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleAddSubStatusSubmit = async () => {
        if (!subStatusDialog.newSubStatusName.trim()) {
            setSubStatusDialog((prev) => ({
                ...prev,
                errors: { name: 'Sub-step name is required' },
            }));
            return;
        }

        setSubStatusDialog((prev) => ({ ...prev, isAdding: true, errors: {} }));

        try {
            router.post(
                route('agents:rep-countries:add-sub-status', { repCountryStatus: subStatusDialog.statusId }),
                {
                    name: subStatusDialog.newSubStatusName,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSubStatusDialog((prev) => ({ ...prev, isOpen: false }));
                    },
                    onError: (errors) => {
                        setSubStatusDialog((prev) => ({
                            ...prev,
                            errors: errors,
                        }));
                    },
                    onFinish: () => {
                        setSubStatusDialog((prev) => ({ ...prev, isAdding: false }));
                    },
                },
            );
        } catch (e) {
            setSubStatusDialog((prev) => ({
                ...prev,
                errors: { name: 'An error occurred while adding sub-step' },
            }));
            setSubStatusDialog((prev) => ({ ...prev, isAdding: false }));
            console.log(e);
        }
    };

    const closeSubStatusDialog = () => {
        setSubStatusDialog((prev) => ({ ...prev, isOpen: false }));
    };

    const openSubStatusesSheet = (status: RepCountryStatus) => {
        setSheetTitle(`Sub-Steps for "${status.status_name}"`);
        setSubStatusesSheet({
            isOpen: true,
            status,
        });
    };

    const handleSheetOpenChange = (open: boolean) => {
        if (!open) {
            // Add a small delay to allow the sheet to close smoothly
            setTimeout(() => {
                setSubStatusesSheet({
                    isOpen: false,
                    status: null,
                });
                // Keep the title for a bit longer to prevent flickering
                setTimeout(() => {
                    setSheetTitle('');
                }, 300);
            }, 150);
        } else {
            setSubStatusesSheet((prev) => ({ ...prev, isOpen: true }));
        }
    };

    const handleAddSubStatusFromSheet = (statusId: string, statusName: string) => {
        // Close the sheet first
        setSubStatusesSheet({
            isOpen: false,
            status: null,
        });

        // Then open the dialog after a short delay
        setTimeout(() => {
            handleAddSubStatus(statusId, statusName);
        }, 200);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Representing Countries" />

            <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Representing Countries" description='Manage countries you represent and their application processes'/>

                    </div>
                    <Link href={route('agents:rep-countries:create')} className="w-full sm:w-auto">
                        <Button className="w-full cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Country
                        </Button>
                    </Link>
                </div>

                {/* Stats and Filter Section */}
                <div className="flex flex-col gap-4">
                    {/* Country Filter */}
                    <div className="flex w-full flex-col space-y-2 sm:max-w-[280px]">
                        <Label htmlFor="country-filter" className="text-sm font-medium">
                            Filter by Country
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                    disabled={isLoading}
                                >
                                    <div className="flex min-w-0 items-center space-x-2">
                                        {selectedCountry !== 'all' && (
                                            <img
                                                src={availableCountries.find((c) => c.id === selectedCountry)?.flag}
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
                                            {availableCountries.map((country) => (
                                                <CommandItem key={country.id} value={country.name} onSelect={() => handleCountryFilter(country.id)}>
                                                    <Check
                                                        className={cn('mr-2 h-4 w-4', selectedCountry === country.id ? 'opacity-100' : 'opacity-0')}
                                                    />
                                                    <div className="flex min-w-0 items-center space-x-2">
                                                        <img src={country.flag} alt={country.name} className="h-3 w-4 flex-shrink-0 rounded" />
                                                        <span className="truncate">{country.name}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {isLoading && <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Settings className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-muted-foreground text-sm">Total Countries</p>
                                        <p className="text-xl font-semibold sm:text-2xl">{repCountriesTotal}</p>
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
                                        <p className="text-xl font-semibold sm:text-2xl">{repCountriesActive}</p>
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

                {/* Countries Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {repCountries.data.map((repCountry) => (
                            <Card key={repCountry.id} className="transition-shadow hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex min-w-0 items-center justify-between">
                                        <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                                            <img
                                                src={repCountry.country.flag}
                                                alt={repCountry.country.name}
                                                className="h-4 w-6 flex-shrink-0 rounded shadow-sm sm:h-6 sm:w-8"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="truncate text-sm sm:text-base lg:text-lg">{repCountry.country.name}</CardTitle>
                                                <div className="mt-1 flex items-center space-x-1 sm:space-x-2">
                                                    {isSwitchLoading(repCountry.id) ? (
                                                        <Loader className="h-3 w-3 animate-spin text-blue-500 sm:h-4 sm:w-4" />
                                                    ) : (
                                                        <StatusSwitch
                                                            id={repCountry.id}
                                                            checked={repCountry.is_active}
                                                            route={route('agents:rep-countries:toggle-status', repCountry.id)}
                                                            showLabel={false}
                                                        />
                                                    )}
                                                    <Badge variant={repCountry.is_active ? 'default' : 'outline'} className="text-xs">
                                                        {repCountry.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Status Count */}
                                    <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                                        <FileText className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">{repCountry.statuses?.length || 0} application steps</span>
                                    </div>

                                    {/* Created Date */}
                                    <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                                        <Calendar className="h-4 w-4 flex-shrink-0" />
                                        <span className="truncate">
                                            Added:{' '}
                                            {(() => {
                                                const dateStr = repCountry.created?.string?.split('T')[0] || '';
                                                if (!dateStr) return 'N/A';
                                                const [y, m, d] = dateStr.split('-');
                                                return `${d}-${m}-${y}`;
                                            })()}
                                        </span>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-1 pt-2 sm:gap-2">
                                        <Link href={route('agents:rep-countries:add-notes', repCountry.id)}>
                                            <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                                                Notes
                                            </Button>
                                        </Link>
                                        <Link href={route('agents:rep-countries:reorder-statuses', repCountry.id)}>
                                            <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                                                <ArrowUpDown className="mr-1 h-3 w-3" />
                                                Reorder
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={() => addStatusDialog.openDialog(repCountry.id, repCountry.country.name)}
                                            variant="default"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                        >
                                            Add Step
                                        </Button>
                                    </div>

                                    {/* Status Preview */}
                                    {repCountry.statuses && repCountry.statuses.length > 0 && (
                                        <div className="border-t pt-2">
                                            <div className="mb-2 flex items-center justify-between">
                                                <p className="text-muted-foreground text-xs font-medium">Application Steps:</p>
                                                {repCountry.statuses.length > 3 && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs"
                                                        onClick={() => toggleCardExpansion(repCountry.id)}
                                                    >
                                                        {expandedCards[repCountry.id] ? (
                                                            <>
                                                                <ChevronUp className="h-3 w-3" />
                                                                Show Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="h-3 w-3" />
                                                                View All ({repCountry.statuses.length})
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                {(expandedCards[repCountry.id] ? repCountry.statuses : repCountry.statuses.slice(0, 3)).map(
                                                    (status: RepCountryStatus, index: number) => (
                                                        <div key={status.id} className="flex min-w-0 items-center justify-between text-xs">
                                                            <span className="text-muted-foreground mr-2 min-w-0 flex-1 truncate">
                                                                {index + 1}. {status.status_name}
                                                            </span>
                                                            {status.status_name !== 'New' && (
                                                                <div className="flex flex-shrink-0 items-center space-x-1">
                                                                    {isSwitchLoading(status.id) ? (
                                                                        <Loader className="h-3 w-3 animate-spin text-blue-500" />
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
                                                                        variant="default"
                                                                        size="sm"
                                                                        className="h-6 w-6 flex-shrink-0 p-0"
                                                                    >
                                                                        <Edit className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleAddSubStatus(status.id, status.status_name)}
                                                                        variant="default"
                                                                        size="sm"
                                                                        className="h-6 w-6 flex-shrink-0 p-0"
                                                                        title="Add sub-step"
                                                                    >
                                                                        <Layers className="h-3 w-3" />
                                                                    </Button>
                                                                    {status.sub_statuses && status.sub_statuses.length > 0 && (
                                                                        <Button
                                                                            onClick={() => openSubStatusesSheet(status)}
                                                                            variant="default"
                                                                            size="sm"
                                                                            className="h-6 w-6 flex-shrink-0 p-0"
                                                                            title="View sub-steps"
                                                                        >
                                                                            <FileText className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                                {!expandedCards[repCountry.id] && repCountry.statuses.length > 3 && (
                                                    <p className="text-muted-foreground text-xs">+{repCountry.statuses.length - 3} more steps</p>
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
                {!isLoading && repCountries.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                                <Settings className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No countries found</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first representing country</p>
                            <Link href={route('agents:rep-countries:create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Country
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination Controls */}
                {!isLoading && repCountries.meta.last_page > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(repCountries.meta.current_page - 1)}
                                />
                            </PaginationItem>

                            {Array.from({ length: repCountries.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    {typeof page === 'string' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            className="cursor-pointer"
                                            size="default"
                                            onClick={() => handlePageChange(page)}
                                            isActive={page === repCountries.meta.current_page}
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
                                    onClick={() => handlePageChange(repCountries.meta.current_page + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
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
                                    onChange={(e) => addStatusDialog.setNewStatusName(e.target.value)}
                                    placeholder="e.g., Document Review, Interview, Approval"
                                    disabled={addStatusDialog.isAdding}
                                    autoFocus
                                />
                                {addStatusDialog.errors.name && <p className="text-sm text-red-600">{addStatusDialog.errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={addStatusDialog.isAdding || !addStatusDialog.newStatusName.trim()}
                                onClick={addStatusDialog.handleAddStatus}
                            >
                                {addStatusDialog.isAdding ? 'Adding...' : 'Add Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
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
                                    onChange={(e) => editStatusDialog.setEditedStatusName(e.target.value)}
                                    placeholder="Step name"
                                    disabled={editStatusDialog.isEditing}
                                    autoFocus
                                />
                                {editStatusDialog.errors.status_name && <p className="text-sm text-red-600">{editStatusDialog.errors.status_name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={editStatusDialog.isEditing || !editStatusDialog.editedStatusName.trim()}
                                onClick={editStatusDialog.handleEditStatus}
                            >
                                {editStatusDialog.isEditing ? 'Updating...' : 'Update Step'}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
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
                                    onChange={(e) => setSubStatusDialog((prev) => ({ ...prev, newSubStatusName: e.target.value }))}
                                    placeholder="e.g., Document Review, Interview, Approval"
                                    disabled={subStatusDialog.isAdding}
                                    autoFocus
                                />
                                {subStatusDialog.errors.name && <p className="text-sm text-red-600">{subStatusDialog.errors.name}</p>}
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
                                <Button variant="outline">Cancel</Button>
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
                                    onChange={(e) => subStatusActions.setEditedName(e.target.value)}
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
                                <Button variant="outline">Cancel</Button>
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
                                    <Loader className="h-6 w-6 animate-spin text-blue-500" />
                                </div>
                            ) : subStatusesSheet.status.sub_statuses && subStatusesSheet.status.sub_statuses.length > 0 ? (
                                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                    {subStatusesSheet.status.sub_statuses.map((subStatus: SubStatus, index: number) => (
                                        <div key={subStatus.id} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 sm:p-4">
                                            <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 sm:h-8 sm:w-8 sm:text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-medium text-gray-900 sm:text-base">{subStatus.name}</h4>
                                                    <p className="text-xs text-gray-500 sm:text-sm">{subStatus.is_active ? 'Active' : 'Inactive'}</p>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
                                                {subStatusActions.isToggleLoading(subStatus.id) ? (
                                                    <Loader className="h-4 w-4 animate-spin text-blue-500" />
                                                ) : (
                                                    <Switch
                                                        checked={subStatus.is_active || false}
                                                        onCheckedChange={(checked: boolean) =>
                                                            subStatusActions.handleToggleSubStatus(subStatus, checked)
                                                        }
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
                                                    variant="default"
                                                    size="icon"
                                                    className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                                                    title="Edit sub-step"
                                                >
                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-6 text-center sm:py-8">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                                        <Layers className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                                    </div>
                                    <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">No sub-steps yet</h3>
                                    <p className="mb-4 px-4 text-sm text-gray-500">
                                        Add sub-steps to break down this application step into smaller tasks.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            if (subStatusesSheet.status) {
                                                handleAddSubStatusFromSheet(subStatusesSheet.status.id, subStatusesSheet.status.status_name);
                                            }
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
                                    >
                                        <Layers className="mr-2 h-4 w-4" />
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
