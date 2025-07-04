import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader, Layers, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { SubStatus, RepCountryStatus } from '@/types';
import type { UseSubStatusActionsReturn } from '@/hooks/use-sub-status-actions';

interface SubStatusesSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    status: RepCountryStatus | null;
    sheetTitle: string;
    subStatusActions: UseSubStatusActionsReturn;
    handleAddSubStatusFromSheet: (statusId: string, statusName: string) => void;
    refreshSubStatusesInSheet: () => void;
}

export default function SubStatusesSheet({
    open,
    onOpenChange,
    status,
    sheetTitle,
    subStatusActions,
    handleAddSubStatusFromSheet,
    refreshSubStatusesInSheet,
}: SubStatusesSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="fixed top-0 right-0 h-screen w-full sm:w-[540px] lg:w-[700px] bg-white z-50 shadow-lg transition-transform overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-lg sm:text-xl">{sheetTitle}</SheetTitle>
                    <SheetDescription className="text-sm">
                        Manage the sub-steps for this application step. You can toggle their status and edit their names.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {!status ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : status.sub_statuses && status.sub_statuses.length > 0 ? (
                        <div className="grid w-full flex-1 auto-rows-min gap-6">
                            {status.sub_statuses.map((subStatus: SubStatus, index: number) => (
                                <div key={subStatus.id} className="flex items-center gap-2 w-full rounded-lg border bg-gray-50 p-3 sm:p-4 overflow-hidden">
                                    <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 sm:h-8 sm:w-8 sm:text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-medium text-gray-900 sm:text-base">{subStatus.name}</h4>
                                            <p className="text-xs text-gray-500 sm:text-sm">{subStatus.is_active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink-0 items-center space-x-2">
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
                                    if (status) {
                                        handleAddSubStatusFromSheet(status.id, status.status_name);
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
    );
}