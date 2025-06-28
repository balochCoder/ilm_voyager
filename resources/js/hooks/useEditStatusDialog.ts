import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { RepCountryStatus } from '@/types';

interface UseEditStatusDialogReturn {
    isOpen: boolean;
    currentStatus: RepCountryStatus | null;
    editedStatusName: string;
    isEditing: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    openDialog: (status: RepCountryStatus) => void;
    closeDialog: () => void;
    setEditedStatusName: (name: string) => void;
    handleEditStatus: (e: React.FormEvent) => void;
}

export function useEditStatusDialog(): UseEditStatusDialogReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<RepCountryStatus | null>(null);
    const [editedStatusName, setEditedStatusName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openDialog = (status: RepCountryStatus) => {
        setCurrentStatus(status);
        setEditedStatusName(status.status_name);
        setIsOpen(true);
        // Focus input after dialog opens
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setTimeout(() => {
            setCurrentStatus(null);
            setEditedStatusName('');
            setIsEditing(false);
        }, 500);
    };

    const handleEditStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentStatus || !editedStatusName.trim()) return;

        setIsEditing(true);
        router.patch(
            route('agents:rep-countries:edit-status', currentStatus.id),
            {
                status_name: editedStatusName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeDialog();
                },
                onError: (errors) => {
                    toast.error('Failed to update status');
                    console.error('Error updating status:', errors);
                },
                onFinish: () => {
                    setIsEditing(false);
                },
            },
        );
    };

    return {
        isOpen,
        currentStatus,
        editedStatusName,
        isEditing,
        inputRef,
        openDialog,
        closeDialog,
        setEditedStatusName,
        handleEditStatus,
    };
}
