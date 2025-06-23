import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Textarea } from '@/components/ui/textarea';

interface Status {
    id: string;
    name: string;
    pivot?: {
        notes: string | null;
    };
}

interface RepCountry {
    id: string;
    country: { name: string };
}

interface Props {
    repCountry: RepCountry;
    statuses: Status[];
}

export default function AddNotes({ repCountry, statuses }: Props) {
    // Initialize status_notes as an object with status ids as keys
    const initialStatusNotes: Record<string, string> = {};
    statuses.forEach(status => {
        initialStatusNotes[status.id] = status.pivot?.notes || '';
    });

    const { data, setData, post, processing, errors } = useForm<{
        status_notes: Record<string, string>;
    }>({
        status_notes: initialStatusNotes,
    });

    const handleChange = (statusId: string, value: string) => {
        setData('status_notes', {
            ...data.status_notes,
            [statusId]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:rep-countries:store-notes', repCountry.id));
    };

    return (
        <AppLayout>
            <Head title="Add Notes Representing Countries" />
            <div className="flex h-full flex-1 flex-col p-4">
                <Heading title='Status Notes'/>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                    {statuses.map((status, idx) => (
                        <div key={status.id}>
                            <Label htmlFor={`status-${status.id}`}>{`${idx + 1}. ${status.name}`}</Label>
                            <Textarea
                                id={`status-${status.id}`}
                                className="w-full mt-1"
                                value={data.status_notes[status.id] || ''}
                                onChange={e => handleChange(status.id, e.target.value)}
                                rows={2}
                            />
                            {errors?.status_notes && typeof errors.status_notes === 'object' && errors.status_notes[status.id] && (
                                <p className="text-sm text-red-600 mt-1">{errors.status_notes[status.id]}</p>
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
