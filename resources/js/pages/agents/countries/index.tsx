import { Head } from '@inertiajs/react';
import CountriesList from '@/components/countries-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Country } from '@/types';
import Heading from '@/components/heading';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />

            <div className="flex h-full flex-1 flex-col  rounded-xl p-4">
                <Heading title='Countries List' />
                <CountriesList countries={countries} />
            </div>
        </AppLayout>
    );
}
