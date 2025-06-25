import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseAddStatusSheetReturn {
    isOpen: boolean;
    currentRepCountryId: string | null;
    currentRepCountryName: string | null;
    newStatusName: string;
    isAdding: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    openSheet: (repCountryId: string, repCountryName: string) => void;
    closeSheet: () => void;
    setNewStatusName: (name: string) => void;
    handleAddStatus: (e: React.FormEvent) => void;
}

export function useAddStatusSheet(): UseAddStatusSheetReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [currentRepCountryId, setCurrentRepCountryId] = useState<string | null>(null);
    const [currentRepCountryName, setCurrentRepCountryName] = useState<string | null>(null);
    const [newStatusName, setNewStatusName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openSheet = (repCountryId: string, repCountryName: string) => {
        setCurrentRepCountryId(repCountryId);
        setCurrentRepCountryName(repCountryName);
        setNewStatusName('');
        setIsOpen(true);
        // Focus input after sheet opens
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const closeSheet = () => {
        setIsOpen(false);
        setTimeout(() => {
            setCurrentRepCountryId(null);
            setCurrentRepCountryName(null);
            setNewStatusName('');
            setIsAdding(false);
        }, 2000);
    };

    const handleAddStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentRepCountryId || !newStatusName.trim()) return;

        setIsAdding(true);
        router.post(
            route('agents:rep-countries:add-status', currentRepCountryId),
            {
                name: newStatusName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Reset input instead of closing sheet
                    setNewStatusName('');
                    toast.success('Status added successfully!');
                    // Focus input again for next entry
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 100);
                },
                onError: (errors) => {
                    toast.error('Failed to add status');
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
        inputRef,
        openSheet,
        closeSheet,
        setNewStatusName,
        handleAddStatus,
    };
}
