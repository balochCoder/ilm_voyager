import { Head } from '@inertiajs/react';
import CountriesList from '@/components/countries/countries-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country } from '@/types';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Search } from 'lucide-react';
import StatsCard from '@/components/stats-card';

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

            <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div className="w-full">
                        <Heading title='Countries Database' description='Browse and manage all available countries in the system' />
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-start sm:justify-end">
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <Globe className="w-3 h-3 mr-1" aria-label="Globe icon" />
                            {totalCountries} Countries
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <StatsCard
                        icon={<Globe className="w-4 h-4 text-blue-600" aria-label="Total countries icon" />}
                        label="Total Countries"
                        value={totalCountries}
                        bgColor="bg-blue-100"
                        iconAriaLabel="Total countries icon"
                    />
                    <StatsCard
                        icon={<Search className="w-4 h-4 text-green-600" aria-label="Available for selection icon" />}
                        label="Available for Selection"
                        value={totalCountries}
                        bgColor="bg-green-100"
                        iconAriaLabel="Available for selection icon"
                    />
                </div>

                {/* Countries List Section */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                        <div className="mb-2 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">All Countries</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Browse through all countries available in the system
                            </p>
                        </div>
                        <CountriesList countries={countries} />
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:space-x-3 space-y-2 sm:space-y-0">
                            <div className="p-2 bg-blue-100 rounded-lg mb-2 sm:mb-0">
                                <Globe className="w-4 h-4 text-blue-600" aria-label="Help section globe icon" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">About Countries Database</h3>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
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
