import { useState } from 'react';
import { router } from '@inertiajs/react';

interface UseSwitchStateReturn {
    loadingStates: { [key: string]: boolean };
    toggleSwitch: (id: string, newValue: boolean, route: string, onSuccess?: () => void) => void;
    isSwitchLoading: (id: string) => boolean;
}

export function useSwitchState(): UseSwitchStateReturn {
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

    const toggleSwitch = (id: string, newValue: boolean, route: string, onSuccess?: () => void) => {
        setLoadingStates(prev => ({ ...prev, [id]: true }));
        
        router.patch(route, {
            is_active: newValue
        }, {
            onFinish: () => setLoadingStates(prev => ({ ...prev, [id]: false })),
            onSuccess: () => {
                router.reload({ only: ['repCountries'] });
                if (onSuccess) onSuccess();
            },
            preserveScroll: true,
        });
    };

    const isSwitchLoading = (id: string): boolean => {
        return loadingStates[id] || false;
    };

    return {
        loadingStates,
        toggleSwitch,
        isSwitchLoading,
    };
} 