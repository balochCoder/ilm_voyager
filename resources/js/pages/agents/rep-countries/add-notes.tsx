import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem, RepCountry, SharedData, Status } from '@/types';
import { useEffect } from 'react';
import { toast } from 'sonner';




interface Props {
    repCountry: RepCountry;
    statuses: any[]; // repCountryStatuses structure
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
    {
        title: 'Status Notes',
        href: '/agents/representing-countries/add-notes',
    },
];

export default function AddNotes({ repCountry, statuses }: Props) {
    const { flash } = usePage<SharedData>().props;
    // Initialize status_notes as an object with status_name as keys
    const initialStatusNotes: Record<string, string> = {};
    statuses.forEach(status => {
        initialStatusNotes[status.status_name] = status.notes || '';
    });

    const { data, setData, post, processing, errors } = useForm<{
        status_notes: Record<string, string>;
    }>({
        status_notes: initialStatusNotes,
    });

    const handleChange = (statusName: string, value: string) => {
        setData('status_notes', {
            ...data.status_notes,
            [statusName]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:rep-countries:store-notes', repCountry.id));
    };
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Notes Representing Countries" />
            <div className="flex h-full flex-1 flex-col p-4">
                <Heading title='Status Notes' />
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                    {statuses.map((status, idx) => (
                        <div key={status.status_name}>
                            <Label htmlFor={`status-${status.status_name}`}>{`${idx + 1}. ${status.status_name}`}</Label>
                            <Textarea
                                id={`status-${status.status_name}`}
                                className="w-full mt-1"
                                value={data.status_notes[status.status_name] || ''}
                                onChange={e => handleChange(status.status_name, e.target.value)}
                                rows={2}
                            />
                            {errors?.status_notes && typeof errors.status_notes === 'object' && errors.status_notes[status.status_name] && (
                                <p className="text-sm text-red-600 mt-1">{errors.status_notes[status.status_name]}</p>
                            )}
                        </div>
                    ))}
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Notes'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
