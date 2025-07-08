import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, RotateCcw } from 'lucide-react';
import { CourseResource, SharedData } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CourseLevel {
  id: string | number;
  name: string;
}

interface Course {
    id: string | number;
    title: string;
    quality_of_desired_application?: string;
    institution_name?: string;
    country_name?: string;
    duration_year?: string;
    duration_month?: string;
    duration_week?: string;
    course_categories?: string[];
    intake_month?: string[];
    course_level?: { name?: string };
    course_fee?: string;
    campus?: string;
    general_eligibility?: string;
    country_flag?: string;
}

interface Props {
    courses: {
        data: Course[];
        meta: any;
    };
    filterOptions: {
        countries: { id: string; name: string }[];
        categories: { id: string; name: string }[];
        levels: { id: string; name: string }[];
        intakes: string[];
        qualities: string[];
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Find Courses', href: '/agents/find-courses' },
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

function renderQualityStars(quality?: string) {
    let stars = 0;
    switch (quality) {
        case 'excellent': stars = 4; break;
        case 'good': stars = 3; break;
        case 'average': stars = 2; break;
        case 'below_average': stars = 1; break;
        default: stars = 0;
    }
    return (
        <span title={quality || '-'}>
            {Array.from({ length: 4 }).map((_, i) => (
                <span key={i}>{i < stars ? '★' : '☆'}</span>
            ))}
        </span>
    );
}

export default function GlobalCoursesIndex({ courses, filterOptions }: Props) {
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
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedIntake, setSelectedIntake] = useState<string>('all');
    const [selectedQuality, setSelectedQuality] = useState<string>('all');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        setIsLoading(false);
    }, [courses.meta.current_page]);

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

    const hasFilterChanges = () => {
        return selectedCourseLevel !== initialFilters.courseLevel ||
               courseName !== initialFilters.courseName ||
               campus !== initialFilters.campus ||
               keyword !== initialFilters.keyword;
    };

    const hasActiveFilters = () => {
        return (
            selectedCountry !== 'all' ||
            selectedCategory !== 'all' ||
            selectedIntake !== 'all' ||
            selectedCourseLevel !== 'all' ||
            selectedQuality !== 'all' ||
            keyword !== '' ||
            amount !== ''
        );
    };

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
        if (selectedCountry && selectedCountry !== 'all') url.searchParams.set('filter[country_id]', selectedCountry);
        else url.searchParams.delete('filter[country_id]');
        if (selectedCategory && selectedCategory !== 'all') url.searchParams.set('filter[course_category]', selectedCategory);
        else url.searchParams.delete('filter[course_category]');
        if (selectedIntake && selectedIntake !== 'all') url.searchParams.set('filter[intake]', selectedIntake);
        else url.searchParams.delete('filter[intake]');
        if (selectedQuality && selectedQuality !== 'all') url.searchParams.set('filter[quality_of_desired_application]', selectedQuality);
        else url.searchParams.delete('filter[quality_of_desired_application]');
        if (amount) url.searchParams.set('filter[course_fee]', amount);
        else url.searchParams.delete('filter[course_fee]');
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
        setSelectedCountry('all');
        setSelectedCategory('all');
        setSelectedIntake('all');
        setSelectedCourseLevel('all');
        setSelectedQuality('all');
        setKeyword('');
        setAmount('');
        setIsLoading(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('filter[country_id]');
        url.searchParams.delete('filter[course_category]');
        url.searchParams.delete('filter[intake]');
        url.searchParams.delete('filter[course_level_id]');
        url.searchParams.delete('filter[quality_of_desired_application]');
        url.searchParams.delete('filter[keyword]');
        url.searchParams.delete('filter[course_fee]');
        url.searchParams.delete('page');
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
            <Head title="Find Courses" />
            <div className="flex flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title="Find Courses" description="Browse all available courses across all institutions" />
                    </div>
                </div>
                {/* Filter/Search Row */}
                <div className="flex flex-col gap-2 w-full mb-2">
                    <div className="flex flex-row flex-wrap gap-4 w-full">
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="country_filter" className="text-sm font-medium">Country</Label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    {filterOptions.countries.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="category_filter" className="text-sm font-medium">Course Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {filterOptions.categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="intake_filter" className="text-sm font-medium">Intake</Label>
                            <Select value={selectedIntake} onValueChange={setSelectedIntake}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Intakes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Intakes</SelectItem>
                                    {filterOptions.intakes.map(intake => (
                                        <SelectItem key={intake} value={intake}>{intake}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="course_level_filter" className="text-sm font-medium">Course Level</Label>
                            <Select value={selectedCourseLevel} onValueChange={setSelectedCourseLevel}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {filterOptions.levels.map(level => (
                                        <SelectItem key={level.id} value={String(level.id)}>{level.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4 w-full">
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="quality_filter" className="text-sm font-medium">Quality Of Applicant Desired</Label>
                            <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Qualities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Qualities</SelectItem>
                                    {filterOptions.qualities.map(q => (
                                        <SelectItem key={q} value={q}>{q.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="keyword" className="text-sm font-medium">Keyword</Label>
                            <Input id="keyword" type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Any keyword" className="w-full" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 min-w-[180px]">
                            <Label htmlFor="amount" className="text-sm font-medium">Amount (Max Fee)</Label>
                            <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Max fee" className="w-full" min="0" />
                        </div>
                        <div className="flex flex-1 flex-row gap-2 flex-nowrap items-end">
                            <Button
                                type="button"
                                variant="default"
                                className="w-full"
                                onClick={handleSearch}
                                disabled={isLoading || !hasActiveFilters()}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </div>
                        <div className="flex flex-1 flex-row gap-2 flex-nowrap items-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full ml-0"
                                onClick={handleReset}
                                disabled={isLoading || !hasActiveFilters()}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Courses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-lg" />
                        ))
                    ) : courses.data.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 col-span-full">No courses found.</div>
                    ) : (
                        courses.data.map((course: Course) => (
                            <Card key={course.id} className="p-4 flex flex-col gap-2 border border-muted-foreground/10 shadow-sm">
                                <div className="font-semibold text-lg mb-1 truncate" title={course.title}>{course.title}</div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {course.institution_name || '-'}
                                    {course.country_name && (
                                        <>
                                            {', '}
                                            {course.country_flag && (
                                                <img src={course.country_flag} alt="flag" className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                                            )}
                                            {course.country_name}
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span>Level: <span className="font-medium text-foreground">{course.course_level?.name || '-'}</span></span>
                                    <span>Fee: <span className="font-medium text-foreground">{course.course_fee || '-'}</span></span>
                                    <span>Campus: <span className="font-medium text-foreground">{course.campus || '-'}</span></span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span>Duration: <span className="font-medium text-foreground">{formatDuration(course.duration_year || '', course.duration_month || '', course.duration_week || '')}</span></span>
                                    <span>Intakes: <span className="font-medium text-foreground">{Array.isArray(course.intake_month) && course.intake_month.length > 0 ? course.intake_month.join(', ') : '-'}</span></span>
                                </div>
                                {course.course_categories && course.course_categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 text-xs mt-1">
                                        {course.course_categories.map((cat, i) => (
                                            <span key={i} className="bg-muted px-2 py-0.5 rounded-full">{cat}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t my-2" />
                                <div className="text-xs text-foreground">
                                    {renderQualityStars(course.quality_of_desired_application)}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2" title={course.general_eligibility || ''}>
                                    {course.general_eligibility || '-'}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                {/* Pagination */}
                {!isLoading && courses.meta.last_page > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(courses.meta.current_page - 1)}
                                    disabled={courses.meta.current_page === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: courses.meta.last_page }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        isActive={page === courses.meta.current_page}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(courses.meta.current_page + 1)}
                                    disabled={courses.meta.current_page === courses.meta.last_page}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
} 