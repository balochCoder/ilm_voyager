import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, RotateCcw, FileText } from 'lucide-react';
import { SharedData } from '@/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    currency?: { code?: string };
    course_benefits?: string;
    language_requirements?: string;
    start_date?: string;
    end_date?: string;
    awarding_body?: string;
    additional_info?: string;
    documents?: { id: string; title: string; url: string }[];
    application_fee?: string;
    modules?: string[];
    is_language_mandatory?: boolean;
}

interface Props {
    courses: {
        data: Course[];
        meta: Record<string, unknown>;
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

// Custom hook for course sheet state
function useCourseSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const openSheet = (course: Course) => {
        setSelectedCourse(course);
        setIsOpen(true);
    };
    const closeSheet = () => setIsOpen(false);
    return { isOpen, openSheet, closeSheet, selectedCourse };
}

export default function GlobalCoursesIndex({ courses, filterOptions }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCourseLevel, setSelectedCourseLevel] = useState<string>('all');
    const [keyword, setKeyword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedIntake, setSelectedIntake] = useState<string>('all');
    const [selectedQuality, setSelectedQuality] = useState<string>('all');
    const [amount, setAmount] = useState('');
    const courseSheet = useCourseSheet();

    useEffect(() => {
        setIsLoading(false);
    }, [courses.meta.current_page]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const courseLevel = urlParams.get('filter[course_level_id]') || urlParams.get('course_level_id') || 'all';
        const keywordValue = urlParams.get('filter[keyword]') || urlParams.get('keyword') || '';
        if (courseLevel && courseLevel !== 'all') {
            setSelectedCourseLevel(courseLevel);
        }
        setKeyword(keywordValue);
    }, []);

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

    // Build a map of category IDs to names
    const categoryMap = Object.fromEntries(filterOptions.categories.map(cat => [String(cat.id), cat.name]));

    // Type assertions for meta properties
    const lastPage = courses.meta.last_page as number;
    const currentPage = courses.meta.current_page as number;

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-xl" />
                        ))
                    ) : courses.data.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 col-span-full">No courses found.</div>
                    ) : (
                        courses.data.map((course: Course) => (
                            <Card
                                key={course.id}
                                className="p-6 flex flex-col gap-4 rounded-xl shadow-sm border border-muted-foreground/10 bg-white hover:shadow-md transition-shadow min-h-[220px]"
                            >
                                {/* Title and Country (right top) */}
                                <div className="flex items-start justify-between mb-1">
                                    <div className="font-bold text-lg truncate" title={course.title}>{course.title}</div>
                                    {course.country_name && (
                                        <div className="flex items-center gap-1 ml-2 min-w-0">
                                            {course.country_flag && (
                                                <img src={course.country_flag} alt="flag" className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                                            )}
                                            <span className="text-xs text-muted-foreground truncate">{course.country_name}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Meta badges */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                        {course.institution_name || '-'}
                                    </span>
                                    {course.course_level?.name && (
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                            {course.course_level.name}
                                        </span>
                                    )}
                                </div>
                                {/* Key details */}
                                <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-4">
                                    <div>
                                        <span className="font-medium text-foreground">Course Fee:</span> {course.course_fee ? `${course.course_fee}${course.currency && course.currency.code ? ' ' + course.currency.code : ''}` : '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Duration:</span> {formatDuration(course.duration_year || '', course.duration_month || '', course.duration_week || '')}
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Intakes:</span> {Array.isArray(course.intake_month) && course.intake_month.length > 0 ? course.intake_month.join(', ') : '-'}
                                    </div>
                                </div>
                                {/* Quality Stars */}
                                <div className="mb-2">
                                    {renderQualityStars(course.quality_of_desired_application)}
                                </div>
                                {/* Action */}
                                <div className="mt-auto pt-2">
                                    <Button variant="default" size="sm" className="w-full" onClick={() => courseSheet.openSheet(course)}>
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                {/* Pagination */}
                {!isLoading && typeof lastPage === 'number' && typeof currentPage === 'number' && lastPage > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        isActive={page === currentPage}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === lastPage}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
                {/* Course Details Sheet (outside the map) */}
                <Sheet open={courseSheet.isOpen} onOpenChange={open => { if (!open) courseSheet.closeSheet(); }}>
                    <SheetContent side="right" className="w-[1000px] !max-w-none h-screen max-h-screen flex flex-col">
                        {/* Scrollable Details Section */}
                        <ScrollArea className="flex-1 min-h-0 px-8">
                            {/* Header content now inside scroll area */}
                            <div className="mb-0 pb-4 border-b border-primary/20 flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold mb-2 truncate" title={courseSheet.selectedCourse?.title}>{courseSheet.selectedCourse?.title}</h2>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">{courseSheet.selectedCourse?.institution_name || '-'}</span>
                                        <span className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">{courseSheet.selectedCourse?.course_level?.name || '-'}</span>
                                    </div>
                                    <div className="mb-2">{renderQualityStars(courseSheet.selectedCourse?.quality_of_desired_application)}</div>
                                </div>
                                {courseSheet.selectedCourse?.country_name && (
                                    <div className="flex items-center gap-2 min-w-0">
                                        {courseSheet.selectedCourse?.country_flag && (
                                            <img src={courseSheet.selectedCourse.country_flag} alt="flag" className="inline-block w-6 h-6 align-text-bottom" />
                                        )}
                                        <span className="text-base font-medium text-muted-foreground truncate">{courseSheet.selectedCourse.country_name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-0">
                                {/* Details Section */}
                                <div className="rounded-xl shadow-sm p-6 mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Course Fee</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.course_fee ? `${courseSheet.selectedCourse.course_fee}${courseSheet.selectedCourse.currency && courseSheet.selectedCourse.currency.code ? ' ' + courseSheet.selectedCourse.currency.code : ''}` : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Application Fee</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.application_fee ? `${courseSheet.selectedCourse.application_fee}${courseSheet.selectedCourse.currency && courseSheet.selectedCourse.currency.code ? ' ' + courseSheet.selectedCourse.currency.code : ''}` : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Duration</div>
                                            <div className="text-sm font-medium ">{formatDuration(courseSheet.selectedCourse?.duration_year || '', courseSheet.selectedCourse?.duration_month || '', courseSheet.selectedCourse?.duration_week || '')}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Intakes</div>
                                            <div className="text-sm font-medium ">{Array.isArray(courseSheet.selectedCourse?.intake_month) && courseSheet.selectedCourse?.intake_month.length > 0 ? courseSheet.selectedCourse.intake_month.join(', ') : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Campus</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.campus || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Awarding Body</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.awarding_body || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">End Date</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.end_date || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Eligibility</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.general_eligibility || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Language Requirements</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.language_requirements || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Benefits</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.course_benefits || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Additional Info</div>
                                            <div className="text-sm font-medium ">{courseSheet.selectedCourse?.additional_info || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-md font-semibold uppercase mb-1">Language Mandatory</div>
                                            <div className="text-sm font-medium ">{typeof courseSheet.selectedCourse?.is_language_mandatory === 'boolean' ? (courseSheet.selectedCourse.is_language_mandatory ? 'Yes' : 'No') : '-'}</div>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <div className="text-md font-semibold uppercase mb-1">Modules</div>
                                            <div className="text-sm font-medium ">{Array.isArray(courseSheet.selectedCourse?.modules) && courseSheet.selectedCourse.modules.length > 0 ? (<ul className="list-disc pl-5 space-y-1">{courseSheet.selectedCourse.modules.map((mod: string, idx: number) => (<li key={idx}>{mod}</li>))}</ul>) : '-'}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Categories Section */}
                                {courseSheet.selectedCourse?.course_categories && courseSheet.selectedCourse.course_categories.length > 0 && (
                                    <div className="mb-6">
                                        <div className="text-md font-semibold uppercase mb-2">Categories</div>
                                        <div className="flex flex-wrap gap-2">
                                            {courseSheet.selectedCourse.course_categories.map((catId: string, i: number) => (
                                                <span key={i} className="bg-primary/10 px-3 py-1 rounded-full text-base font-medium">{categoryMap[catId] || catId}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Documents Section */}
                                <div className="mb-2">
                                    <div className="text-md font-semibold uppercase mb-2">Documents</div>
                                    {courseSheet.selectedCourse && Array.isArray(courseSheet.selectedCourse.documents) && courseSheet.selectedCourse.documents.length > 0 ? (
                                        <div className="divide-y divide-primary/20 rounded-lg overflow-hidden border border-primary/20 bg-white">
                                            {courseSheet.selectedCourse.documents.map((doc: { id: string; title: string; url: string }, idx: number) => (
                                                <div key={doc.id || idx} className="flex items-center justify-between px-4 py-3 gap-4">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <FileText className="w-5 h-5 flex-shrink-0" />
                                                        <span className="font-semibold text-base truncate">{doc.title || 'Untitled Document'}</span>
                                                    </div>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline hover:/80 transition-colors font-medium text-base"
                                                    >
                                                        View
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
