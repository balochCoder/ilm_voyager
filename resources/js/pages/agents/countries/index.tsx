import { Head } from '@inertiajs/react';
import CountriesList from '@/components/countries-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Country {
    id: string;
    name: string;
    flag: string;
    is_active: boolean;
}

interface Props {
    countries: Country[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title:'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Countries',
        href: '/countries',
    },
];

export default function CountriesIndex({ countries }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />

            <div className="container mx-auto py-6">
                <CountriesList countries={countries} />
            </div>
        </AppLayout>
    );
}
