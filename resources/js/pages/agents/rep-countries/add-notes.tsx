import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem, RepCountry, RepCountryStatus, SharedData } from '@/types';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Props {
    repCountry: RepCountry;
    statuses: RepCountryStatus[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Representing Countries', href: '/agents/representing-countries' },
    { title: 'Status Notes', href: '/agents/representing-countries/add-notes' },
];

const getInitialStatusNotes = (statuses: any[]) => {
    const notes: Record<string, string> = {};
    statuses.forEach(status => {
        notes[status.status_name] = status.notes || '';
    });
    return notes;
};

export default function AddNotes({ repCountry, statuses }: Props) {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors } = useForm<{
        status_notes: Record<string, string>;
    }>({ status_notes: getInitialStatusNotes(statuses) });

    const handleChange = (statusName: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData('status_notes', {
            ...data.status_notes,
            [statusName]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:rep-countries:store-notes', repCountry.id));
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Notes Representing Countries" />
            <div className="flex h-full flex-1 flex-col p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <Heading title='Status Notes' />
                        <p className="text-muted-foreground mt-1">
                            Add detailed notes for each application step
                        </p>
                    </div>
                    <Link href={route('agents:rep-countries:index')}>
                        <Button variant="noShadow" className="cursor-pointer">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Countries
                        </Button>
                    </Link>
                </div>

                {/* Country Info Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src={repCountry.country?.flag}
                                alt={repCountry.country?.name}
                                className="w-12 h-9 rounded shadow-sm"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {repCountry.country?.name}
                                </h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={repCountry.is_active ? "default" : "neutral"}>
                                        {repCountry.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                        <FileText className="w-4 h-4" />
                                        <span>{statuses.length} application steps</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                        {statuses.map((status, idx) => (
                            <Card key={status.status_name} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {idx + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{status.status_name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Step {idx + 1} of {statuses.length}
                                                </p>
                                            </div>
                                        </div>
                                        {status.is_active !== false && (
                                            <Badge variant="default" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor={`status-${status.status_name}`} className="text-sm font-medium">
                                            Notes for this step
                                        </Label>
                                        <Textarea
                                            id={`status-${status.status_name}`}
                                            className="w-full mt-2 resize-none"
                                            value={data.status_notes[status.status_name] || ''}
                                            onChange={handleChange(status.status_name)}
                                            rows={4}
                                            placeholder={`Add notes for ${status.status_name} step...`}
                                        />
                                        {errors?.status_notes && typeof errors.status_notes === 'object' && errors.status_notes[status.status_name] && (
                                            <p className="text-sm text-red-600 mt-2">{errors.status_notes[status.status_name]}</p>
                                        )}
                                    </div>

                                    {/* Character count */}
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <span>
                                            {data.status_notes[status.status_name]?.length || 0} characters
                                        </span>
                                        <span>
                                            {(data.status_notes[status.status_name]?.length || 0) > 500 ? '⚠️ Long note' : '✓ Good length'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{statuses.length}</span> steps to configure
                        </div>
                        <div className="flex space-x-3">
                            <Link href={route('agents:rep-countries:index')}>
                                <Button variant="noShadow" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="min-w-[120px]">
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save All Notes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Help Section */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">Tips for writing effective notes</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Be specific about what documents or information are required</li>
                                    <li>• Include estimated processing times if known</li>
                                    <li>• Mention any special requirements or exceptions</li>
                                    <li>• Keep notes concise but informative</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
