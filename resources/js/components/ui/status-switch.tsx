import { Switch } from '@/components/ui/switch';
import { Loader } from 'lucide-react';
import { useSwitchState } from '@/hooks/use-switch-state';

interface StatusSwitchProps {
    id: string;
    checked: boolean;
    route: string;
    showLabel?: boolean;
    onSuccess?: () => void;
}

export function StatusSwitch({ id, checked, route, showLabel = true, onSuccess }: StatusSwitchProps) {
    const { toggleSwitch, isSwitchLoading } = useSwitchState();
    const isLoading = isSwitchLoading(id);

    const handleToggle = (newValue: boolean) => {
        toggleSwitch(id, newValue, route, onSuccess);
    };

    return (
        <div className="flex items-center space-x-3">
            {showLabel && !isLoading && (
                <span className="text-sm">
                    {checked ? 'Active' : 'Inactive'}
                </span>
            )}
            {isLoading ? (
                <Loader className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
                <Switch
                    checked={checked}
                    onCheckedChange={handleToggle}
                    className="data-[state=checked]:bg-blue-500 dark:data-[state=unchecked]:bg-rose-500"
                />
            )}
        </div>
    );
}
