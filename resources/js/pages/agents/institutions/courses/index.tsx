import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Copy, Globe } from 'lucide-react';
import { CourseResource } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


interface Props {
    courses: CourseResource;
    institution: { id: string | number; institution_name: string };
    not_language_mandatory_count: number;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/representing-institutions' },
    { title: 'Courses', href: '#' },
];

function formatDuration(year: string, month: string, week: string) {
    const y = parseInt(year || '0', 10);
    const m = parseInt(month || '0', 10);
    const w = parseInt(week || '0', 10);
    const parts = [];
    if (y > 0) parts.push(`${y} Year${y > 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} Month${m > 1 ? 's' : ''}`);
    if (w > 0) parts.push(`${w} Week${w > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' ') : '-';
}

export default function CoursesIndex({ courses, institution, not_language_mandatory_count }: Props) {
    // Pagination handler
    const handlePageChange = (page: number) => {
           // Preserve all current query params and just update the page param
           const url = new URL(window.location.href);
           url.searchParams.set('page', String(page));
           router.visit(url.toString(), { preserveState: true, preserveScroll: true });
       };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Courses for ${institution.institution_name}`} />
            <div className="flex flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title={`Courses for ${institution.institution_name}`} description="List of all courses for this institution" />
                    </div>
                    <Link href={route('agents:institutions:courses:create', { institution: institution.id })} className="w-full sm:w-auto">
                        <Button variant="default" className="cursor-pointer w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Course
                        </Button>
                    </Link>
                </div>
                {/* Statistics Section */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                    <Card>
                        <div className="p-4 flex items-center space-x-2">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Copy className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-muted-foreground text-sm">Total Courses</p>
                                <p className="text-xl font-semibold sm:text-2xl">{courses.meta.total}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-4 flex items-center space-x-2">
                            <div className="rounded-lg bg-green-100 p-2">
                                <Globe className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-muted-foreground text-sm">Language Not Mandatory</p>
                                <p className="text-xl font-semibold sm:text-2xl">{not_language_mandatory_count}</p>
                            </div>
                        </div>
                    </Card>
                </div>
                <div>
                    {courses.data.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">No courses found for this institution.</div>
                    ) : (
                        <div className="space-y-6">
                            {courses.data.map(course => (
                                <Card
                                    key={course.id}
                                    className="group p-0 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between px-6 pt-5 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="text-lg font-bold capitalize text-gray-900">{course.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {course.course_level?.name && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                                                            {course.course_level.name}
                                                        </span>
                                                    )}
                                                    {course.is_language_mandatory !== undefined && (
                                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${course.is_language_mandatory
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {course.is_language_mandatory ? 'Language Required' : 'Language Optional'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href="#">
                                                <Button size="icon" variant="ghost" className="hover:bg-gray-100">
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-6 pb-5">
                                        <div>
                                            <div className="text-xs text-gray-400">Duration</div>
                                            <div className="text-sm text-gray-700">
                                                {formatDuration(course.duration_year, course.duration_month, course.duration_week)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Course Fee</div>
                                            <div className="text-sm text-gray-700">
                                                {course.course_fee
                                                    ? `${course.course_fee} ${course.currency?.code || '-'}`
                                                    : '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Campus</div>
                                            <div className="text-sm text-gray-700">{course.campus || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Eligibility</div>
                                            <div className="text-sm text-gray-700">{course.general_eligibility || '-'}</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                {/* Pagination Controls */}
                { courses.meta.last_page > 1 && (
                    <Pagination className="mt-8">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(courses.meta.current_page - 1)}
                                />
                            </PaginationItem>

                            {Array.from({ length: courses.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    {typeof page === 'string' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            className="cursor-pointer"
                                            size="default"
                                            onClick={() => handlePageChange(page)}
                                            isActive={page === courses.meta.current_page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    className="cursor-pointer"
                                    size="default"
                                    onClick={() => handlePageChange(courses.meta.current_page + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}

            </div>
        </AppLayout>
    );
}
