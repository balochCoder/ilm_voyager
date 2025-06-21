import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';

interface Country {
    id: string;
    name: string;
    flag: string;
}

interface RepCountry {
    id: string;
    monthly_living_cost: string | null;
    visa_requirements: string | null;
    part_time_work_details: string | null;
    country_benefits: string | null;
    is_active: boolean;
    country: Country;
    created_at: string;
    updated_at: string;
}

interface Props {
    repCountry: RepCountry;
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
        title: 'Details',
        href: '/agents/rep-countries/show',
    },
];

export default function RepCountriesShow({ repCountry }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rep Country - ${repCountry.country.name}`} />

            <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Link href="/agents/rep-countries" className="mr-4">
                            <Button variant="neutral" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">Rep Country Details</h1>
                    </div>
                    <Link href={`/agents/rep-countries/${repCountry.id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-600 mb-2">Country</h3>
                                <div className="flex items-center">
                                    <img 
                                        src={repCountry.country.flag} 
                                        alt={repCountry.country.name}
                                        className="w-6 h-4 mr-2 rounded"
                                    />
                                    <span className="text-lg">{repCountry.country.name}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm text-gray-600 mb-2">Status</h3>
                                <Badge variant={repCountry.is_active ? 'default' : 'neutral'}>
                                    {repCountry.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm text-gray-600 mb-2">Monthly Living Cost</h3>
                                <p className="text-lg">
                                    {repCountry.monthly_living_cost || 'Not specified'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timestamps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-sm text-gray-600 mb-2">Created</h3>
                                <p>{new Date(repCountry.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-gray-600 mb-2">Last Updated</h3>
                                <p>{new Date(repCountry.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Visa Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {repCountry.visa_requirements ? (
                                <div className="whitespace-pre-wrap">{repCountry.visa_requirements}</div>
                            ) : (
                                <p className="text-gray-500">No visa requirements specified</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Part-time Work Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {repCountry.part_time_work_details ? (
                                <div className="whitespace-pre-wrap">{repCountry.part_time_work_details}</div>
                            ) : (
                                <p className="text-gray-500">No part-time work details specified</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Country Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {repCountry.country_benefits ? (
                                <div className="whitespace-pre-wrap">{repCountry.country_benefits}</div>
                            ) : (
                                <p className="text-gray-500">No country benefits specified</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 