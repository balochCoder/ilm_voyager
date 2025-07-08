import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country, Status } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Briefcase, FileText, Gift, Globe, Plus, Settings } from 'lucide-react';

interface Props {
    countries: Country[];
    statuses: Status[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Representing Countries', href: '/agents/representing-countries' },
    { title: 'Add Country', href: '/agents/representing-countries/create' },
];

const initialFormState = (newStatusId: string) => ({
    monthly_living_cost: '',
    visa_requirements: '',
    part_time_work_details: '',
    country_benefits: '',
    is_active: false,
    country_id: '',
    status_ids: newStatusId ? [newStatusId] : [],
});

type FormField =
    | 'monthly_living_cost'
    | 'visa_requirements'
    | 'part_time_work_details'
    | 'country_benefits'
    | 'is_active'
    | 'country_id'
    | 'status_ids';

export default function RepCountriesCreate({ countries, statuses }: Props) {
    const newStatus = statuses.find((s) => s.name === 'New');
    const newStatusId = newStatus ? newStatus.id : '';
    const { data, setData, post, processing, errors } = useForm(initialFormState(newStatusId));

    const handleInputChange = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(field, e.target.value);
    };

    const handleStatusChange = (selected: string[]) => {
        // Always keep 'New' selected
        setData('status_ids', Array.from(new Set([newStatusId, ...selected.filter((id) => id !== newStatusId)])));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:rep-countries:store'), {
            onSuccess: () => router.reload({ only: ['countries'] }),
        });
    };

    const selectedCountry = countries.find((c) => c.id === data.country_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Representing Country" />
            <div className="flex h-full min-w-0 flex-1 flex-col space-y-4 p-4 sm:space-y-6 sm:p-6">
                {/* Header Section */}
                <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Add Representing Country" description="Create a new representing country with detailed information" />
                    </div>
                    <Link href={route('agents:rep-countries:index')} className="w-full sm:w-auto">
                        <Button variant="default" className="w-full cursor-pointer">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Countries
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="min-w-0 space-y-4 sm:space-y-6">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                <div className="w-fit flex-shrink-0 rounded-lg bg-blue-100 p-2">
                                    <Globe className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Select the country and set basic details</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="country_id" className="text-sm font-medium">
                                        Country *
                                    </Label>
                                    <Select value={data.country_id} onValueChange={(value) => setData('country_id', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.id} value={country.id}>
                                                    <div className="flex items-center">
                                                        <img src={country.flag} alt={country.name} className="mr-2 h-3 w-4 rounded" />
                                                        {country.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.country_id && <p className="text-sm text-red-600">{errors.country_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monthly_living_cost" className="text-sm font-medium">
                                        Monthly Living Cost
                                    </Label>

                                    {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                                    <Input
                                        type="number"
                                        id="monthly_living_cost"
                                        value={data.monthly_living_cost}
                                        onChange={handleInputChange('monthly_living_cost')}
                                        placeholder="Monthly Living Cost"
                                    />

                                    {errors.monthly_living_cost && <p className="text-sm text-red-600">{errors.monthly_living_cost}</p>}
                                </div>
                            </div>

                            {selectedCountry && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                        <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="h-6 w-8 flex-shrink-0 rounded shadow-sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-medium text-blue-900 sm:text-base">{selectedCountry.name} selected</h3>
                                            <p className="text-xs text-blue-700 sm:text-sm">
                                                You're adding {selectedCountry.name} as a representing country
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Requirements Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                <div className="w-fit flex-shrink-0 rounded-lg bg-amber-100 p-2">
                                    <FileText className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Requirements & Procedures</CardTitle>
                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                        Document visa requirements and application procedures
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="visa_requirements" className="text-sm font-medium">
                                        Visa Requirements
                                    </Label>
                                    <Textarea
                                        id="visa_requirements"
                                        value={data.visa_requirements}
                                        onChange={handleInputChange('visa_requirements')}
                                        placeholder="Enter detailed visa requirements, application procedures, required documents, processing times, and any special conditions..."
                                        rows={4}
                                        className="resize-none"
                                    />
                                    {errors.visa_requirements && <p className="text-sm text-red-600">{errors.visa_requirements}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work & Benefits Card */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                    <div className="w-fit flex-shrink-0 rounded-lg bg-green-100 p-2">
                                        <Briefcase className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl">Work Opportunities</CardTitle>
                                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Part-time work details and restrictions</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="part_time_work_details" className="text-sm font-medium">
                                        Part-time Work Details
                                    </Label>
                                    <Textarea
                                        id="part_time_work_details"
                                        value={data.part_time_work_details}
                                        onChange={handleInputChange('part_time_work_details')}
                                        placeholder="Enter part-time work opportunities, restrictions, hours allowed, types of jobs available, and any special conditions..."
                                        rows={4}
                                        className="resize-none"
                                    />
                                    {errors.part_time_work_details && <p className="text-sm text-red-600">{errors.part_time_work_details}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                    <div className="w-fit flex-shrink-0 rounded-lg bg-purple-100 p-2">
                                        <Gift className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl">Country Benefits</CardTitle>
                                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Advantages of studying in this country</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="country_benefits" className="text-sm font-medium">
                                        Benefits & Advantages
                                    </Label>
                                    <Textarea
                                        id="country_benefits"
                                        value={data.country_benefits}
                                        onChange={handleInputChange('country_benefits')}
                                        placeholder="Enter benefits, advantages, quality of education, cultural opportunities, career prospects, and other positive aspects..."
                                        rows={4}
                                        className="resize-none"
                                    />
                                    {errors.country_benefits && <p className="text-sm text-red-600">{errors.country_benefits}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Application Steps Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                                <div className="w-fit flex-shrink-0 rounded-lg bg-indigo-100 p-2">
                                    <Settings className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Application Process Steps</CardTitle>
                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Configure the application process workflow</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status_ids" className="text-sm font-medium">
                                        Application Steps
                                    </Label>
                                    <div className="w-full sm:w-1/2">
                                        <MultiSelect
                                            options={statuses.map((status) => ({
                                                label: status.name,
                                                value: status.id,
                                                disabled: status.id === newStatusId,
                                            }))}
                                            onValueChange={handleStatusChange}
                                            defaultValue={data.status_ids}
                                            placeholder="Select application steps"
                                            className="w-full"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">The "New" step is automatically included and cannot be removed</p>
                                    {errors.status_ids && <p className="text-sm text-red-600">{errors.status_ids}</p>}
                                </div>

                                {data.status_ids.length > 0 && (
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h4 className="mb-2 text-sm font-medium text-gray-900">Selected Steps:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.status_ids.map((statusId) => {
                                                const status = statuses.find((s) => s.id === statusId);
                                                return status ? (
                                                    <Badge
                                                        key={statusId}
                                                        variant={statusId === newStatusId ? 'outline' : 'default'}
                                                        className="text-xs"
                                                    >
                                                        {status.name}
                                                        {statusId === newStatusId && ' (Fixed)'}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex min-w-0 flex-col items-start justify-between space-y-4 border-t pt-4 sm:flex-row sm:items-center sm:space-y-0 sm:pt-6">
                        <div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
                            <span className="font-medium">{countries.length}</span> countries available for selection
                        </div>
                        <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-3">
                            <Link href={route('agents:rep-countries:index')} className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="w-full min-w-[180px] sm:w-auto">
                                {processing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Representing Country
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
