import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Copy, Globe, Search, RotateCcw, Edit } from 'lucide-react';
import { CourseResource, SharedData } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusSwitch } from '@/components/ui/status-switch';
import { toast } from 'sonner';

interface CourseLevel {
  id: string | number;
  name: string;
}

interface Props {
    courses: CourseResource;
    institution: { id: string | number; institution_name: string };
    not_language_mandatory_count: number;
    courseLevels: CourseLevel[];
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

export default function CoursesIndex({ courses, institution, not_language_mandatory_count, courseLevels }: Props) {
    const {flash} = usePage<SharedData>().props;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCourseLevel, setSelectedCourseLevel] = useState<string>('all');
    const [courseName, setCourseName] = useState('');
    const [campus, setCampus] = useState('');
    const [keyword, setKeyword] = useState('');
    const [initialFilters, setInitialFilters] = useState({
        courseLevel: 'all',
        courseName: '',
        campus: '',
        keyword: '',
    });

    // Set loading state on page change
    useEffect(() => {
        setIsLoading(false);
    }, [courses.meta.current_page]);

    // Initialize filters from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const courseLevel = urlParams.get('filter[course_level_id]') || urlParams.get('course_level_id') || 'all';
        const name = urlParams.get('filter[course_name]') || urlParams.get('course_name') || '';
        const campusValue = urlParams.get('filter[campus]') || urlParams.get('campus') || '';
        const keywordValue = urlParams.get('filter[keyword]') || urlParams.get('keyword') || '';
        if (courseLevel && courseLevel !== 'all') {
            setSelectedCourseLevel(courseLevel);
        }
        setCourseName(name);
        setCampus(campusValue);
        setKeyword(keywordValue);
        setInitialFilters({
            courseLevel,
            courseName: name,
            campus: campusValue,
            keyword: keywordValue,
        });
    }, []);

    // Check if filters have been modified from initial state
    const hasFilterChanges = () => {
        return selectedCourseLevel !== initialFilters.courseLevel ||
               courseName !== initialFilters.courseName ||
               campus !== initialFilters.campus ||
               keyword !== initialFilters.keyword;
    };

    // Check if any filters are currently applied
    const hasActiveFilters = () => {
        return selectedCourseLevel !== 'all' ||
               courseName !== '' ||
               campus !== '' ||
               keyword !== '';
    };

    // Pagination handler
    const handlePageChange = (page: number) => {
        setIsLoading(true);
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(page));
        router.visit(url.toString(), { preserveState: true, preserveScroll: true });
    };

    function handleSearch() {
        const url = new URL(window.location.href);
        if (selectedCourseLevel && selectedCourseLevel !== 'all') url.searchParams.set('filter[course_level_id]', selectedCourseLevel);
        else url.searchParams.delete('filter[course_level_id]');
        if (courseName) url.searchParams.set('filter[course_name]', courseName);
        else url.searchParams.delete('filter[course_name]');
        if (campus) url.searchParams.set('filter[campus]', campus);
        else url.searchParams.delete('filter[campus]');
        if (keyword) url.searchParams.set('filter[keyword]', keyword);
        else url.searchParams.delete('filter[keyword]');
        url.searchParams.delete('page');
        setIsLoading(true);
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleReset() {
        setCourseName('');
        setCampus('');
        setKeyword('');
        setSelectedCourseLevel('all');
        setIsLoading(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('filter[course_level_id]');
        url.searchParams.delete('filter[course_name]');
        url.searchParams.delete('filter[campus]');
        url.searchParams.delete('filter[keyword]');
        router.visit(url.toString(), {
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false),
            preserveState: true,
            preserveScroll: true,
        });
    }

     useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        }
    }, [flash]);

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
                            <Plus className="w-4 h-4" />
                            Add Course
                        </Button>
                    </Link>
                </div>
                {/* Filter/Search Row */}
                <div className="flex flex-row flex-wrap gap-4 w-full mb-2">
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="course_level_filter" className="text-sm font-medium">Course Level</Label>
                        <Select value={selectedCourseLevel} onValueChange={setSelectedCourseLevel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                {courseLevels.map(level => (
                                    <SelectItem key={level.id} value={String(level.id)}>{level.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="course_name" className="text-sm font-medium">Course Name</Label>
                        <Input id="course_name" type="text" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Search by name" className="w-full" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="campus" className="text-sm font-medium">Campus</Label>
                        <Input id="campus" type="text" value={campus} onChange={e => setCampus(e.target.value)} placeholder="Search by campus" className="w-full" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                        <Label htmlFor="keyword" className="text-sm font-medium">Keyword</Label>
                        <Input id="keyword" type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Any keyword" className="w-full" />
                    </div>
                    <div className="flex flex-1 flex-row gap-2 flex-nowrap items-end">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleSearch}
                            disabled={isLoading || !hasFilterChanges()}
                            className="flex-1"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading || !hasActiveFilters()}
                            className="min-w-[100px]"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                    </div>
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
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, index) => (
                                <Card key={index} className="animate-pulse">
                                    <div className="flex items-center justify-between px-6 pt-5 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <Skeleton className="h-6 w-32 mb-2 rounded" />
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Skeleton className="h-4 w-16 rounded" />
                                                    <Skeleton className="h-4 w-24 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-6 pb-5">
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-1 rounded" />
                                            <Skeleton className="h-5 w-24 rounded" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-1 rounded" />
                                            <Skeleton className="h-5 w-24 rounded" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-1 rounded" />
                                            <Skeleton className="h-5 w-24 rounded" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-4 w-20 mb-1 rounded" />
                                            <Skeleton className="h-5 w-24 rounded" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : courses.data.length === 0 ? (
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
                                            <StatusSwitch
                                                id={`course-status-${course.id}`}
                                                checked={course.is_active}
                                                route={route('agents:institutions:courses:toggle-status', { institution: institution.id, course: course.id })}
                                                showLabel={false}
                                            />
                                            <Link href={route('agents:institutions:courses:edit', { institution: institution.id, course: course.id })} className="ml-2">
                                                <Button variant="outline" size="icon">
                                                    <Edit className="h-4 w-4" />
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
                {!isLoading && courses.meta.last_page > 1 && (
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
