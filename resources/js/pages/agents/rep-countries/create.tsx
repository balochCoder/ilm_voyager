import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Country {
    id: string;
    name: string;
    flag: string;
}

interface Props {
    countries: Country[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/agents/dashboard',
    },
    {
        title: 'Rep Countries',
        href: '/agents/rep-countries',
    },
    {
        title: 'Create',
        href: '/agents/rep-countries/create',
    },
];

export default function RepCountriesCreate({ countries }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        monthly_living_cost: '',
        visa_requirements: '',
        part_time_work_details: '',
        country_benefits: '',
        is_active: false,
        country_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/agents/rep-countries');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Rep Country" />

            <div className="container mx-auto py-6">
                <div className="flex items-center mb-6">
                    <Link href="/agents/rep-countries" className="mr-4">
                        <Button variant="neutral" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Create Rep Country</h1>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Rep Country Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    id="monthly_living_cost"
                                    value={data.monthly_living_cost}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('monthly_living_cost', e.target.value)}
                                    placeholder="e.g., $2,000 - $3,000"
                                />
                                {errors.monthly_living_cost && (
                                    <p className="text-sm text-red-600 mt-1">{errors.monthly_living_cost}</p>
                                )}
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

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link href="/agents/rep-countries">
                                    <Button type="button" variant="neutral">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Rep Country'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 