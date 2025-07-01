import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil } from 'lucide-react';

interface Course {
  id: string | number;
  title: string;
  course_level: { name: string } | null;
  duration_year: string;
  duration_month: string;
  duration_week: string;
  course_fee: string;
  campus_location: string;
  general_eligibility?: string;
  is_language_mandatory?: boolean;
}

interface Props {
  courses: Course[];
  institution: { id: string | number; institution_name: string };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Institutions', href: '/agents/representing-institutions' },
  { title: 'Courses', href: '#' },
];

export default function CoursesIndex({ courses, institution }: Props) {
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
        <div>
          <div className="text-gray-600 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center">
              <span className="mr-1">🏛️</span>
              Total Courses : {courses.length}
            </span>
            <span className="ml-auto text-xs text-gray-400">Displaying From 1</span>
          </div>
          {courses.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No courses found for this institution.</div>
          ) : (
            <div className="space-y-6">
              {courses.map(course => (
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
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              course.is_language_mandatory
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
                        {course.duration_year && <span>{String(course.duration_year).padStart(2, '0')}Y </span>}
                        {course.duration_month && <span>{String(course.duration_month).padStart(2, '0')}M </span>}
                        {course.duration_week && <span>{String(course.duration_week).padStart(2, '0')}W</span>}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Course Fee</div>
                      <div className="text-sm text-gray-700">{course.course_fee ? `${course.course_fee} GBP` : '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Campus</div>
                      <div className="text-sm text-gray-700">{course.campus_location || '-'}</div>
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
      </div>
    </AppLayout>
  );
}
