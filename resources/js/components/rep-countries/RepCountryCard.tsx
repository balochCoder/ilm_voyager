import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusSwitch } from '@/components/ui/status-switch';
import { Link } from '@inertiajs/react';
import { Loader, ArrowUpDown, Calendar, FileText, ChevronUp, ChevronDown, Edit, Layers } from 'lucide-react';
import { RepCountryStatus, RepCountry } from '@/types';
import React from 'react';

interface RepCountryCardProps {
    repCountry: RepCountry;
    expanded: boolean;
    isSwitchLoading: (id: string) => boolean;
    toggleCardExpansion: (countryId: string) => void;
    addStatusDialog: {
        openDialog: (id: string, name: string) => void;
    };
    editStatusDialog: {
        openDialog: (status: RepCountryStatus) => void;
    };
    handleAddSubStatus: (statusId: string, statusName: string) => void;
    openSubStatusesSheet: (status: RepCountryStatus) => void;
    toggleStatusUrl: string;
    addNotesUrl: string;
    reorderStatusesUrl: string;
    toggleRepCountryStatusUrl: (statusId: string) => string;
}

const RepCountryCard: React.FC<RepCountryCardProps> = ({
    repCountry,
    expanded,
    isSwitchLoading,
    toggleCardExpansion,
    addStatusDialog,
    editStatusDialog,
    handleAddSubStatus,
    openSubStatusesSheet,
    toggleStatusUrl,
    addNotesUrl,
    reorderStatusesUrl,
    toggleRepCountryStatusUrl,
}) => {
    return (
        <Card className="transition-shadow hover:shadow-md">
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
                                        route={toggleStatusUrl}
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
                    <Link href={addNotesUrl}>
                        <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                            Notes
                        </Button>
                    </Link>
                    <Link href={reorderStatusesUrl}>
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
                                    {expanded ? (
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
                            {(expanded ? repCountry.statuses : repCountry.statuses.slice(0, 3)).map(
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
                                                        route={toggleRepCountryStatusUrl(status.id)}
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
                            {!expanded && repCountry.statuses.length > 3 && (
                                <p className="text-muted-foreground text-xs">+{repCountry.statuses.length - 3} more steps</p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RepCountryCard;
