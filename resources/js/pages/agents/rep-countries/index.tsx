import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Country, RepCountryResource, RepCountryStatus, SharedData, Status } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronsUpDown,
    Loader2,
    Plus,
    Settings,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import StatsCard from '@/components/stats-card';
import AddStatusDialog from '@/components/rep-countries/add-status-dialog';
import EditStatusDialog from '@/components/rep-countries/edit-status-dialog';
import AddSubStatusDialog from '@/components/rep-countries/add-sub-status-dialog';
import EditSubStatusDialog from '@/components/rep-countries/edit-sub-status-dialog';
import SubStatusesSheet from '@/components/rep-countries/SubStatusesSheet';
import { useAddStatusDialog } from '@/hooks/use-add-status-dialog';
import { useEditStatusDialog } from '@/hooks/use-edit-status-dialog';
import { useSubStatusActions } from '@/hooks/use-sub-status-actions';
import { useSwitchState } from '@/hooks/use-switch-state';
import RepCountryCard from '@/components/rep-countries/RepCountryCard';

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
                        <Heading title="Representing Countries" description='Manage countries you represent and their application processes' />

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
                        <StatsCard
                            icon={<Settings className="h-4 w-4 text-blue-600" aria-label="Total countries icon" />}
                            label="Total Countries"
                            value={repCountriesTotal}
                            bgColor="bg-blue-100"
                            iconAriaLabel="Total countries icon"
                        />
                        <StatsCard
                            icon={<Check className="h-4 w-4 text-green-600" aria-label="Active countries icon" />}
                            label="Active"
                            value={repCountriesActive}
                            bgColor="bg-green-100"
                            iconAriaLabel="Active countries icon"
                        />
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
                            <RepCountryCard
                                key={repCountry.id}
                                repCountry={repCountry}
                                expanded={!!expandedCards[repCountry.id]}
                                isSwitchLoading={isSwitchLoading}
                                toggleCardExpansion={toggleCardExpansion}
                                addStatusDialog={addStatusDialog}
                                editStatusDialog={editStatusDialog}
                                handleAddSubStatus={handleAddSubStatus}
                                openSubStatusesSheet={openSubStatusesSheet}
                                toggleStatusUrl={route('agents:rep-countries:toggle-status', repCountry.id)}
                                addNotesUrl={route('agents:rep-countries:add-notes', repCountry.id)}
                                reorderStatusesUrl={route('agents:rep-countries:reorder-statuses', repCountry.id)}
                                toggleRepCountryStatusUrl={(statusId) => route('agents:rep-countries:toggle-rep-country-status', statusId)}
                            />
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
                <AddStatusDialog
                    open={addStatusDialog.isOpen}
                    onOpenChange={addStatusDialog.closeDialog}
                    currentRepCountryName={addStatusDialog.currentRepCountryName}
                    newStatusName={addStatusDialog.newStatusName}
                    setNewStatusName={addStatusDialog.setNewStatusName}
                    isAdding={addStatusDialog.isAdding}
                    errors={addStatusDialog.errors}
                    handleAddStatus={addStatusDialog.handleAddStatus}
                />

                {/* Edit Status Dialog */}
                <EditStatusDialog
                    open={editStatusDialog.isOpen}
                    onOpenChange={editStatusDialog.closeDialog}
                    editedStatusName={editStatusDialog.editedStatusName}
                    setEditedStatusName={editStatusDialog.setEditedStatusName}
                    isEditing={editStatusDialog.isEditing}
                    errors={editStatusDialog.errors}
                    handleEditStatus={editStatusDialog.handleEditStatus}
                />

                {/* Add Sub-Status Dialog */}
                <AddSubStatusDialog
                    open={subStatusDialog.isOpen}
                    onOpenChange={closeSubStatusDialog}
                    statusName={subStatusDialog.statusName}
                    newSubStatusName={subStatusDialog.newSubStatusName}
                    setNewSubStatusName={(name: string) => setSubStatusDialog((prev) => ({ ...prev, newSubStatusName: name }))}
                    isAdding={subStatusDialog.isAdding}
                    errors={subStatusDialog.errors}
                    handleAddSubStatus={() => handleAddSubStatusSubmit()}
                />

                {/* Edit Sub-Status Dialog */}
                <EditSubStatusDialog
                    open={subStatusActions.editDialog.isOpen}
                    onOpenChange={subStatusActions.closeEditDialog}
                    editedName={subStatusActions.editDialog.editedName}
                    setEditedName={subStatusActions.setEditedName}
                    isEditing={subStatusActions.editDialog.isEditing}
                    errors={subStatusActions.editDialog.errors}
                    handleEditSubStatus={() => subStatusActions.handleEditSubStatus()}
                />

                {/* Sub-Statuses Sheet */}
                <SubStatusesSheet
                    open={subStatusesSheet.isOpen}
                    onOpenChange={handleSheetOpenChange}
                    status={subStatusesSheet.status}
                    sheetTitle={sheetTitle}
                    subStatusActions={subStatusActions}
                    handleAddSubStatusFromSheet={handleAddSubStatusFromSheet}
                    refreshSubStatusesInSheet={refreshSubStatusesInSheet}
                />
            </div>
        </AppLayout>
    );
}
