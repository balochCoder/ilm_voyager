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

const getInitialStatusNotes = (statuses: RepCountryStatus[]) => {
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
            <div className="flex flex-1 flex-col items-center p-4 sm:p-6">
                <div className="w-full flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <Heading title='Status Notes' description='Add detailed notes for each application step'/>

                        </div>
                        <Link href={route('agents:rep-countries:index')} className='w-full sm:w-auto'>
                            <Button variant="default" className="cursor-pointer w-full sm:w-auto">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Countries
                            </Button>
                        </Link>
                    </div>

                    {/* Country Info Card */}
                    <Card className="">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <img
                                    src={repCountry.country?.flag}
                                    alt={repCountry.country?.name}
                                    className="w-10 h-7 sm:w-12 sm:h-9 rounded shadow-sm flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                                        {repCountry.country?.name}
                                    </h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                                        <Badge variant={repCountry.is_active ? "default" : "outline"} className="w-fit">
                                            {repCountry.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <FileText className="w-4 h-4 flex-shrink-0" />
                                            <span>{statuses.length} application steps</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid gap-6">
                            {statuses.map((status, idx) => (
                                <Card key={status.status_name} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <CardTitle className="text-base sm:text-lg truncate">{status.status_name}</CardTitle>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                                        Step {idx + 1} of {statuses.length}
                                                    </p>
                                                </div>
                                            </div>
                                            {status.is_active !== false && (
                                                <Badge variant="default" className="bg-green-100 text-green-800 w-fit">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-4">
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
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-muted-foreground">
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 border-t gap-4">
                            <div className="text-sm text-muted-foreground text-center sm:text-left">
                                <span className="font-medium">{statuses.length}</span> steps to configure
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Link href={route('agents:rep-countries:index')} className="w-full sm:w-auto">
                                    <Button variant="outline" type="button" className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="min-w-[120px] w-full sm:w-auto">
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save All Notes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Help Section */}
                    <Card className="">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 w-fit">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium  mb-2 text-sm sm:text-base">Tips for writing effective notes</h3>
                                    <ul className="text-xs sm:text-sm  space-y-1">
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
            </div>
        </AppLayout>
    );
}
