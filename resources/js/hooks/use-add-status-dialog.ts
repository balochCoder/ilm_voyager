import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseAddStatusDialogReturn {
    isOpen: boolean;
    currentRepCountryId: string | null;
    currentRepCountryName: string;
    newStatusName: string;
    isAdding: boolean;
    errors: Record<string, string>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    openDialog: (repCountryId: string, repCountryName: string) => void;
    closeDialog: () => void;
    setNewStatusName: (name: string) => void;
    handleAddStatus: (e?: React.FormEvent) => void;
    clearErrors: () => void;
}

export function useAddStatusDialog(): UseAddStatusDialogReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [currentRepCountryId, setCurrentRepCountryId] = useState<string | null>(null);
    const [currentRepCountryName, setCurrentRepCountryName] = useState<string>('');
    const [newStatusName, setNewStatusName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openDialog = (repCountryId: string, repCountryName: string) => {
        setCurrentRepCountryId(repCountryId);
        setCurrentRepCountryName(repCountryName);
        setNewStatusName('');
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
            setCurrentRepCountryId(null);
            setCurrentRepCountryName('');
            setNewStatusName('');
            setIsAdding(false);
            setErrors({});
        }, 500);
    };

    const clearErrors = () => {
        setErrors({});
    };

    const handleAddStatus = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!currentRepCountryId || !newStatusName.trim()) return;

        setIsAdding(true);
        setErrors({});
        router.post(
            route('agents:rep-countries:add-status', currentRepCountryId),
            {
                name: newStatusName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Reset input instead of closing dialog
                    setNewStatusName('');
                    setErrors({});
                    toast.success('Status added successfully!');
                    // Focus input again for next entry
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 100);

                    setIsOpen(false); // Optionally close dialog after success
                },
                onError: (errors) => {
                    setErrors(errors);
                    console.error('Error adding status:', errors);
                },
                onFinish: () => {
                    setIsAdding(false);
                },
            },
        );
    };

    return {
        isOpen,
        currentRepCountryId,
        currentRepCountryName,
        newStatusName,
        isAdding,
        errors,
        inputRef,
        openDialog,
        closeDialog,
        setNewStatusName,
        handleAddStatus,
        clearErrors,
    };
}
