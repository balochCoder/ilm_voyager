import { Head } from '@inertiajs/react';
import CountriesList from '@/components/countries-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country } from '@/types';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Search } from 'lucide-react';

interface Props {
    countries: Country[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Countries',
        href: '/countries',
    },
];

export default function CountriesIndex({ countries }: Props) {
    const totalCountries = countries.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />

            <div className="flex h-full flex-1 flex-col p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <Heading title='Countries Database' />
                        <p className="text-muted-foreground mt-1">
                            Browse and manage all available countries in the system
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <Globe className="w-3 h-3 mr-1" />
                            {totalCountries} Countries
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Countries</p>
                                    <p className="text-2xl font-semibold">{totalCountries}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Search className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Available for Selection</p>
                                    <p className="text-2xl font-semibold">{totalCountries}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Countries List Section */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">All Countries</h3>
                            <p className="text-sm text-muted-foreground">
                                Browse through all countries available in the system
                            </p>
                        </div>
                        <CountriesList countries={countries} />
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">About Countries Database</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• All countries are available for selection in application processes</li>
                                    <li>• Countries can be used for representing countries</li>
                                    <li>• Country data includes flags, names, and identification</li>
                                    <li>• Use the search and filter options to find specific countries</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
