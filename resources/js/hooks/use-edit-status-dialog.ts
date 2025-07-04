import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { RepCountryStatus } from '@/types';

interface UseEditStatusDialogReturn {
    isOpen: boolean;
    currentStatus: RepCountryStatus | null;
    editedStatusName: string;
    isEditing: boolean;
    errors: Record<string, string>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    openDialog: (status: RepCountryStatus) => void;
    closeDialog: () => void;
    setEditedStatusName: (name: string) => void;
    handleEditStatus: (e?: React.FormEvent) => void;
    clearErrors: () => void;
}

export function useEditStatusDialog(): UseEditStatusDialogReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<RepCountryStatus | null>(null);
    const [editedStatusName, setEditedStatusName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openDialog = (status: RepCountryStatus) => {
        setCurrentStatus(status);
        setEditedStatusName(status.status_name);
        setErrors({});
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
            setErrors({});
        }, 500);
    };

    const clearErrors = () => {
        setErrors({});
    };

    const handleEditStatus = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!currentStatus || !editedStatusName.trim()) return;

        setIsEditing(true);
        setErrors({});
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
                    setErrors(errors);
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
        errors,
        inputRef,
        openDialog,
        closeDialog,
        setEditedStatusName,
        handleEditStatus,
        clearErrors,
    };
}
