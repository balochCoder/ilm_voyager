import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RepCountry, SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccordionItem } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    Pagination, 
    PaginationContent, 
    PaginationEllipsis, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from '@/components/ui/pagination';
import { Plus, Minus } from 'lucide-react';
import Heading from '@/components/heading';
import { toast } from 'sonner';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    has_more_pages: boolean;
    has_previous_page: boolean;
}

interface Props {
    repCountries: RepCountry[];
    pagination: PaginationData;
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
];

// Mock application process data - you can replace this with real data from your backend
const mockApplicationProcess = [
    { id: 1, step: 'Document Preparation', status: 'Completed', actions: 'View Details' },
    { id: 2, step: 'Application Submission', status: 'In Progress', actions: 'Continue' },
    { id: 3, step: 'Visa Processing', status: 'Pending', actions: 'Track Status' },
    { id: 4, step: 'Interview Scheduling', status: 'Not Started', actions: 'Schedule' },
    { id: 5, step: 'Final Approval', status: 'Not Started', actions: 'Await' },
];

export default function RepCountriesIndex({ repCountries, pagination }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
    const [activeStates, setActiveStates] = useState<{ [key: string]: boolean }>(() => {
        // Initialize with the current active states from props
        const initialStates: { [key: string]: boolean } = {};
        repCountries.forEach(country => {
            initialStates[country.id] = country.is_active;
        });
        return initialStates;
    });

    const toggleAccordion = (countryId: string) => {
        setOpenAccordions(prev => ({
            ...prev,
            [countryId]: !prev[countryId]
        }));
    };

    const toggleActiveStatus = (countryId: string) => {
        const newActiveState = !activeStates[countryId];

        // Optimistically update the UI
        setActiveStates(prev => ({
            ...prev,
            [countryId]: newActiveState
        }));

        // Use Inertia router to send the request
        router.patch(route('agents:rep-countries:toggle-status', countryId), {
            is_active: newActiveState
        }, {
            onError: (errors) => {
                // Revert the optimistic update if the request fails
                setActiveStates(prev => ({
                    ...prev,
                    [countryId]: !newActiveState
                }));
                console.error('Error updating country status:', errors);
            }

        });
    };

    // Helper function to generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const current = pagination.current_page;
        const last = pagination.last_page;
        
        // Always show first page
        pages.push(1);
        
        if (current > 3) {
            pages.push('...');
        }
        
        // Show pages around current page
        for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
            if (i !== 1 && i !== last) {
                pages.push(i);
            }
        }
        
        if (current < last - 2) {
            pages.push('...');
        }
        
        // Always show last page if there's more than one page
        if (last > 1) {
            pages.push(last);
        }
        
        return pages;
    };

    useEffect(() => {
        // use toast if flash.success
        if (flash?.success) {
            // Show a toast notification or alert with the success message
            toast.success(flash?.success); // Replace with your toast implementation
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Representing Countries" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <Heading title='Representing Countries' />
                    <Link href={route('agents:rep-countries:create')} prefetch>
                        <Button className='cursor-pointer'>
                            <Plus className="w-4 h-4" />
                            Add Representing Country
                        </Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {repCountries.map((repCountry) => (
                        <div key={repCountry.id} className="border overflow-hidden shadow-sm">
                            {/* Alert with Country Information */}
                            <Alert className="border-l-4 bg-main border-blue-500 rounded-b-none border-b-0 rounded-t-none border-t-0 border-b-transparent">
                                <AlertDescription className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={repCountry.country.flag}
                                            alt={repCountry.country.name}
                                            className="w-8 h-6 rounded shadow-sm"
                                        />
                                        <span className="font-semibold text-lg text-gray-900">
                                            {repCountry.country.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-black">
                                            {activeStates[repCountry.id] ? 'Active' : 'Inactive'}
                                        </span>
                                        <Switch
                                            checked={activeStates[repCountry.id]}
                                            onCheckedChange={() => toggleActiveStatus(repCountry.id)}
                                            className="data-[state=checked]:bg-blue-500"
                                        />
                                    </div>
                                </AlertDescription>
                            </Alert>

                            {/* Accordion for Application Process Management */}
                            <AccordionItem className="border-0">
                                <div className="flex items-center border-l-4 border-blue-500 justify-between w-full p-4 bg-white hover:bg-gray-50 rounded-t-none border-t-0 rounded-b-none border-b-0 shadow-none">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleAccordion(repCountry.id)}
                                            className="font-medium hover:text-gray-900 text-blue-600 transition-colors cursor-pointer"
                                        >
                                            View Application Process
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => toggleAccordion(repCountry.id)}
                                        className="p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer   "
                                    >
                                        {openAccordions[repCountry.id] ? (
                                            <Minus className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                </div>

                                {/* Accordion Content with Table */}
                                {openAccordions[repCountry.id] && (
                                    <div className="bg-white border-l-4 border-blue-500">

                                        {/* Application Process Table */}
                                        <div className="overflow-x-auto">
                                            <Table className='border-l-0 border-b-0 border-r-0'>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>S.No</TableHead>
                                                        <TableHead>Steps</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {mockApplicationProcess.map((process, index) => (
                                                        <TableRow key={process.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell className="font-medium">{process.step}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        process.status === 'Completed' ? 'default' :
                                                                        process.status === 'In Progress' ? 'default' :
                                                                        process.status === 'Pending' ? 'neutral' : 'neutral'
                                                                    }
                                                                >
                                                                    {process.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="neutral" size="sm">
                                                                    {process.actions}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </AccordionItem>
                        </div>
                    ))}

                    {repCountries.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No representing countries found. Create your first one!
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-gray-700 whitespace-nowrap">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} results
                        </div>
                        <div className="flex-shrink-0">
                            <Pagination>
                                <PaginationContent>
                                    {pagination.current_page > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                href={`${route('agents:rep-countries:index')}?page=${pagination.current_page - 1}`}
                                            />
                                        </PaginationItem>
                                    )}
                                    
                                    {getPageNumbers().map((page, index) => (
                                        <PaginationItem key={index}>
                                            {page === '...' ? (
                                                <PaginationEllipsis />
                                            ) : (
                                                <PaginationLink
                                                    href={`${route('agents:rep-countries:index')}?page=${page}`}
                                                    isActive={page === pagination.current_page}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}
                                    
                                    {pagination.has_more_pages && (
                                        <PaginationItem>
                                            <PaginationNext 
                                                href={`${route('agents:rep-countries:index')}?page=${pagination.current_page + 1}`}
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
