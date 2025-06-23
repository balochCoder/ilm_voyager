import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { MultiSelect } from '@/components/ui/multi-select';



interface Props {
    countries: Country[];
    statuses: Status[];
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
        title: 'Add',
        href: '/agents/representing-countries/create',
    },
];

export default function RepCountriesCreate({ countries, statuses }: Props) {
    // Find the 'New' status id
    const newStatus = statuses.find(s => s.name === 'New');
    const newStatusId = newStatus ? newStatus.id : '';
    const { data, setData, post, processing, errors } = useForm({
        monthly_living_cost: '',
        visa_requirements: '',
        part_time_work_details: '',
        country_benefits: '',
        is_active: false,
        country_id: '',
        status_ids: newStatusId ? [newStatusId] : [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:rep-countries:store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Representing Country" />

            <div className="flex h-full flex-1 flex-col p-4">
                <div className="flex justify-between items-center">
                    <Heading title='Add Representing Country' description='Add a new representing country in your system' />
                    <Link href={route('agents:rep-countries:index')} prefetch>
                        <Button className='cursor-pointer' variant="neutral">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="country_id">Country *</Label>
                            <Select
                                value={data.country_id}
                                onValueChange={(value) => setData('country_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country.id} value={country.id}>
                                            <div className="flex items-center">
                                                <img
                                                    src={country.flag}
                                                    alt={country.name}
                                                    className="w-4 h-3 mr-2 rounded"
                                                />
                                                {country.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.country_id && (
                                <p className="text-sm text-red-600 mt-1">{errors.country_id}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="monthly_living_cost">Monthly Living Cost</Label>
                            <Input
                                type='number'
                                id="monthly_living_cost"
                                value={data.monthly_living_cost}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('monthly_living_cost', e.target.value)}
                                placeholder="e.g., 2,000 - 3,000"
                            />
                            {errors.monthly_living_cost && (
                                <p className="text-sm text-red-600 mt-1">{errors.monthly_living_cost}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="visa_requirements">Visa Requirements</Label>
                        <Textarea
                            id="visa_requirements"
                            value={data.visa_requirements}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('visa_requirements', e.target.value)}
                            placeholder="Enter visa requirements and procedures..."
                            rows={4}
                        />
                        {errors.visa_requirements && (
                            <p className="text-sm text-red-600 mt-1">{errors.visa_requirements}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="part_time_work_details">Part-time Work Details</Label>
                        <Textarea
                            id="part_time_work_details"
                            value={data.part_time_work_details}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('part_time_work_details', e.target.value)}
                            placeholder="Enter part-time work opportunities and restrictions..."
                            rows={4}
                        />
                        {errors.part_time_work_details && (
                            <p className="text-sm text-red-600 mt-1">{errors.part_time_work_details}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="country_benefits">Country Benefits</Label>
                        <Textarea
                            id="country_benefits"
                            value={data.country_benefits}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('country_benefits', e.target.value)}
                            placeholder="Enter benefits and advantages of studying in this country..."
                            rows={4}
                        />
                        {errors.country_benefits && (
                            <p className="text-sm text-red-600 mt-1">{errors.country_benefits}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="status_ids">Statuses</Label>
                        <MultiSelect
                            options={statuses.map(status => ({ label: status.name, value: status.id, disabled: status.id === newStatusId }))}
                            onValueChange={selected => {
                                // Always keep 'New' selected
                                if (!selected.includes(newStatusId)) {
                                    setData('status_ids', [newStatusId, ...selected]);
                                } else {
                                    setData('status_ids', Array.from(new Set([newStatusId, ...selected])));
                                }
                            }}
                            defaultValue={data.status_ids}
                            placeholder="Select statuses"
                            className="w-1/2"
                        />
                        {errors.status_ids && (
                            <p className="text-sm text-red-600 mt-1">{errors.status_ids}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link href="/agents/rep-countries">
                            <Button type="button" variant="neutral">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Add Representing Country'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
