import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Layers, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MultiSelect } from '@/components/ui/multi-select';

interface Props {
  institution: { id: string; institution_name: string; campus?: string; quality_of_desired_application?: string; currency_id?: string | number };
  currencies: { id: string; name: string; code: string }[];
  categories: { id: string | number; name: string }[];
  courseLevels: { id: string | number; name: string }[];
  course: any;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Institutions', href: '/agents/representing-institutions' },
  { title: 'Edit Course', href: '#' },
];

export type CourseFormState = {
  title: string;
  course_level_id: string;
  duration_year: string;
  duration_month: string;
  duration_week: string;
  start_date: string;
  end_date: string;
  campus: string;
  awarding_body: string;
  currency_id: string;
  course_fee: string;
  application_fee: string;
  course_benefits: string;
  general_eligibility: string;
  quality_of_desired_application: string;
  is_language_mandatory: boolean;
  language_requirements: string;
  additional_info: string;
  course_categories: string[];
  modules: string[];
  intake_month: string[];
  documents: File[];
  document_titles: string[];
};

function getInitialFormState(course: any, institution: Props['institution']): CourseFormState {
  return {
    title: course.title || '',
    course_level_id: course.course_level_id ? String(course.course_level_id) : '',
    duration_year: course.duration_year ? String(course.duration_year) : '',
    duration_month: course.duration_month ? String(course.duration_month) : '',
    duration_week: course.duration_week ? String(course.duration_week) : '',
    start_date: course.start_date || '',
    end_date: course.end_date || '',
    campus: course.campus || institution.campus || '',
    awarding_body: course.awarding_body || '',
    currency_id: course.currency_id ? String(course.currency_id) : '',
    course_fee: course.course_fee ? String(course.course_fee) : '',
    application_fee: course.application_fee ? String(course.application_fee) : '',
    course_benefits: course.course_benefits || '',
    general_eligibility: course.general_eligibility || '',
    quality_of_desired_application: course.quality_of_desired_application || institution.quality_of_desired_application || '',
    is_language_mandatory: !!course.is_language_mandatory,
    language_requirements: course.language_requirements || '',
    additional_info: course.additional_info || '',
    course_categories: Array.isArray(course.course_categories) ? course.course_categories.map(String) : [],
    modules: Array.isArray(course.modules) && course.modules.length > 0 ? course.modules : [''],
    intake_month: Array.isArray(course.intake_month) ? course.intake_month : [],
    documents: [],
    document_titles: [],
  };
}

type CourseFormField = keyof CourseFormState;

export default function EditCourse({ institution, currencies, categories, courseLevels, course }: Props) {
  const [data, setData] = useForm<CourseFormState>(() => getInitialFormState(course, institution));
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: CourseFormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(field, e.target.value);
  };

  const handleSelectChange = (field: CourseFormField) => (value: string) => {
    setData(field, value);
  };

  const removeFile = (index: number) => {
    const newFiles = [...data.documents];
    const newTitles = [...data.document_titles];
    newFiles.splice(index, 1);
    newTitles.splice(index, 1);
    setData('documents', newFiles);
    setData('document_titles', newTitles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setData('documents', data.documents); // Ensure files are included
    setData('document_titles', data.document_titles);
    // Use Inertia's put method for update
    // @ts-ignore
    window.Inertia.put(route('agents:institutions:courses:update', { institution: institution.id, course: course.id }), data, {
      forceFormData: true,
      onError: (err: any) => setErrors(err),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Course for ${institution.institution_name}`} />
      <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Edit Course" description={`Update course for ${institution.institution_name}`} />
          </div>
          <Link href={route('agents:institutions:courses:index', { institution: institution.id })} className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 min-w-0" encType="multipart/form-data">
          {/* Course Details Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 w-fit">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Course Details</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Edit the main details for this course</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Title <span className="text-red-600">*</span></Label>
                  <Input value={data.title} onChange={handleInputChange('title')} placeholder="Enter course title" required />
                  {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Course Level <span className="text-red-600">*</span></Label>
                  <Select value={data.course_level_id} onValueChange={handleSelectChange('course_level_id')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Course Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseLevels.map(level => (
                        <SelectItem key={level.id} value={String(level.id)}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course_level_id && <div className="text-red-500">{errors.course_level_id}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Campus Location <span className="text-red-600">*</span></Label>
                  <Input
                    value={data.campus}
                    onChange={handleInputChange('campus')}
                    required
                  />
                  {errors.campus && <div className="text-red-500">{errors.campus}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Awarding Body</Label>
                  <Input value={data.awarding_body} onChange={handleInputChange('awarding_body')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees Card */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={data.currency_id} onValueChange={handleSelectChange('currency_id')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((cur) => (
                        <SelectItem key={cur.id} value={cur.id.toString()}>
                          {cur.name} ({cur.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currency_id && <div className="text-red-500">{errors.currency_id}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Course Fee</Label>
                  <Input type="number" value={data.course_fee} onChange={handleInputChange('course_fee')} />
                </div>
                <div className="space-y-2">
                  <Label>Application Fee</Label>
                  <Input type="number" value={data.application_fee} onChange={handleInputChange('application_fee')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Card */}
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>General Eligibility</Label>
                  <Textarea value={data.general_eligibility} onChange={handleInputChange('general_eligibility')} />
                </div>
                <div className="space-y-2">
                  <Label>Quality of Desired Application <span className="text-red-600">*</span></Label>
                  <Input value={data.quality_of_desired_application} onChange={handleInputChange('quality_of_desired_application')} required />
                  {errors.quality_of_desired_application && <div className="text-red-500">{errors.quality_of_desired_application}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Is Language Mandatory?</Label>
                  <Switch checked={data.is_language_mandatory} onCheckedChange={checked => setData('is_language_mandatory', checked)} />
                </div>
                <div className="space-y-2">
                  <Label>Language Requirements</Label>
                  <Textarea value={data.language_requirements} onChange={handleInputChange('language_requirements')} />
                </div>
                <div className="space-y-2">
                  <Label>Course Benefits</Label>
                  <Textarea value={data.course_benefits} onChange={handleInputChange('course_benefits')} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={data.start_date} onChange={handleInputChange('start_date')} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={data.end_date} onChange={handleInputChange('end_date')} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (Years)</Label>
                  <Input type="number" value={data.duration_year} onChange={handleInputChange('duration_year')} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (Months)</Label>
                  <Input type="number" value={data.duration_month} onChange={handleInputChange('duration_month')} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (Weeks)</Label>
                  <Input type="number" value={data.duration_week} onChange={handleInputChange('duration_week')} />
                </div>
                <div className="space-y-2">
                  <Label>Intake Months</Label>
                  <MultiSelect
                    options={[
                      { value: 'January', label: 'January' },
                      { value: 'February', label: 'February' },
                      { value: 'March', label: 'March' },
                      { value: 'April', label: 'April' },
                      { value: 'May', label: 'May' },
                      { value: 'June', label: 'June' },
                      { value: 'July', label: 'July' },
                      { value: 'August', label: 'August' },
                      { value: 'September', label: 'September' },
                      { value: 'October', label: 'October' },
                      { value: 'November', label: 'November' },
                      { value: 'December', label: 'December' },
                    ]}
                    value={data.intake_month}
                    onChange={vals => setData('intake_month', vals)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Additional Information</Label>
                  <Textarea value={data.additional_info} onChange={handleInputChange('additional_info')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Categories Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 w-fit">
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Course Categories</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select all categories that apply to this course</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                {categories.map((cat: { id: string | number; name: string }) => {
                  const catId = String(cat.id);
                  return (
                    <label key={catId} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={data.course_categories.includes(catId)}
                        onChange={e => {
                          if (e.target.checked) {
                            setData('course_categories', [...data.course_categories, catId]);
                          } else {
                            setData('course_categories', data.course_categories.filter((id: string) => id !== catId));
                          }
                        }}
                      />
                      {cat.name}
                    </label>
                  );
                })}
              </div>
              {errors.course_categories && <div className="text-red-500">{errors.course_categories}</div>}
            </CardContent>
          </Card>

          {/* Modules Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0 w-fit">
                  <Layers className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Modules</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Add all modules for this course</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {data.modules.map((mod, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={mod}
                      onChange={e => {
                        const newModules = [...data.modules];
                        newModules[idx] = e.target.value;
                        setData('modules', newModules);
                      }}
                      placeholder={`Module ${idx + 1}`}
                      className="w-1/2"
                    />
                    {data.modules.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => {
                        const newModules = [...data.modules];
                        newModules.splice(idx, 1);
                        setData('modules', newModules);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="default" size="sm" className="w-fit px-2 py-1 text-xs" onClick={() => setData('modules', [...data.modules, ''])}>
                  Add Module
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Card (optional, similar to create) */}
          {/* ... You can add document upload logic here if needed ... */}

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Update Course
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
