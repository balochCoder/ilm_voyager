import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { SubStatus } from '@/types';

interface UseSubStatusActionsReturn {
    // Toggle functionality
    isToggleLoading: (id: number) => boolean;
    handleToggleSubStatus: (subStatus: SubStatus, isActive: boolean) => void;
    
    // Edit functionality
    editDialog: {
        isOpen: boolean;
        subStatus: SubStatus | null;
        editedName: string;
        isEditing: boolean;
        errors: { name?: string };
    };
    openEditDialog: (subStatus: SubStatus) => void;
    closeEditDialog: () => void;
    setEditedName: (name: string) => void;
    handleEditSubStatus: () => void;
}

export function useSubStatusActions(): UseSubStatusActionsReturn {
    const [toggleLoadingStates, setToggleLoadingStates] = useState<{ [key: number]: boolean }>({});
    const [editDialog, setEditDialog] = useState<{
        isOpen: boolean;
        subStatus: SubStatus | null;
        editedName: string;
        isEditing: boolean;
        errors: { name?: string };
    }>({
        isOpen: false,
        subStatus: null,
        editedName: '',
        isEditing: false,
        errors: {}
    });

    const isToggleLoading = (id: number) => toggleLoadingStates[id] || false;

    const handleToggleSubStatus = (subStatus: SubStatus, isActive: boolean) => {
        setToggleLoadingStates(prev => ({ ...prev, [subStatus.id]: true }));

        router.patch(route('agents:rep-countries:toggle-sub-status', subStatus.id), {
            is_active: isActive
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Sub-step status updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update sub-step status');
                console.error('Error toggling sub-status:', errors);
            },
            onFinish: () => {
                setToggleLoadingStates(prev => ({ ...prev, [subStatus.id]: false }));
            }
        });
    };

    const openEditDialog = (subStatus: SubStatus) => {
        setEditDialog({
            isOpen: true,
            subStatus,
            editedName: subStatus.name,
            isEditing: false,
            errors: {}
        });
    };

    const closeEditDialog = () => {
        setEditDialog(prev => ({ ...prev, isOpen: false }));
    };

    const setEditedName = (name: string) => {
        setEditDialog(prev => ({ ...prev, editedName: name }));
    };

    const handleEditSubStatus = () => {
        if (!editDialog.subStatus || !editDialog.editedName.trim()) {
            setEditDialog(prev => ({
                ...prev,
                errors: { name: 'Sub-step name is required' }
            }));
            return;
        }

        setEditDialog(prev => ({ ...prev, isEditing: true, errors: {} }));

        router.patch(route('agents:rep-countries:edit-sub-status', editDialog.subStatus.id), {
            name: editDialog.editedName
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Sub-step name updated successfully!');
                closeEditDialog();
            },
            onError: (errors) => {
                setEditDialog(prev => ({
                    ...prev,
                    errors: errors
                }));
            },
            onFinish: () => {
                setEditDialog(prev => ({ ...prev, isEditing: false }));
            }
        });
    };

    return {
        isToggleLoading,
        handleToggleSubStatus,
        editDialog,
        openEditDialog,
        closeEditDialog,
        setEditedName,
        handleEditSubStatus
    };
} 