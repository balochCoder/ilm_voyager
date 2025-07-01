import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, FileText, Image as ImageIcon, File as FileIcon, Trash2, BookOpen, Layers, Calendar as CalendarIcon, Folder, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { MultiSelect } from '@/components/ui/multi-select';

interface Props {
  institution: { id: string; institution_name: string };
  currencies: { id: string; name: string; code: string }[];
  categories: { id: string | number; name: string }[];
  courseLevels: { id: string | number; name: string }[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Institutions', href: '/agents/representing-institutions' },
  { title: 'Add Course', href: '#' },
];

// Define a type for the form state
export type CourseFormState = {
  title: string;
  course_level_id: string;
  duration_year: string;
  duration_month: string;
  duration_week: string;
  start_date: string;
  end_date: string;
  campus_location: string;
  awarding_body: string;
  currency_id: string;
  course_fee: string;
  application_fee: string;
  monthly_living_cost: string;
  part_time_work_details: string;
  course_benefits: string;
  general_eligibility: string;
  quality_of_applicant: string;
  is_language_mandatory: boolean;
  language_requirements: string;
  additional_info: string;
  course_categories: string[];
  modules: string[];
  intake_month: string[];
  documents: File[];
  document_titles: string[];
};

const initialFormState: CourseFormState = {
  title: '',
  course_level_id: '',
  duration_year: '',
  duration_month: '',
  duration_week: '',
  start_date: '',
  end_date: '',
  campus_location: '',
  awarding_body: '',
  currency_id: '',
  course_fee: '',
  application_fee: '',
  monthly_living_cost: '',
  part_time_work_details: '',
  course_benefits: '',
  general_eligibility: '',
  quality_of_applicant: '',
  is_language_mandatory: false,
  language_requirements: '',
  additional_info: '',
  course_categories: [],
  modules: [''],
  intake_month: [],
  documents: [],
  document_titles: [],
};

type CourseFormField = keyof CourseFormState;

function getFileIcon(file: File) {
  const type = file.type;
  if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (type.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
  return <FileIcon className="h-5 w-5 text-gray-400" />;
}

export default function CreateCourse({ institution, currencies, categories, courseLevels }: Props) {
  const { data, setData, post, processing, errors } = useForm(initialFormState);
  const [documentsError, setDocumentsError] = useState('');
  const documentsInputRef = useRef<HTMLInputElement>(null);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [startCalendarMonth, setStartCalendarMonth] = useState<Date>(data.start_date ? new Date(data.start_date) : new Date());
  const [endCalendarMonth, setEndCalendarMonth] = useState<Date>(data.end_date ? new Date(data.end_date) : new Date());

  const handleInputChange = (field: CourseFormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(field, e.target.value);
  };

  const handleSelectChange = (field: CourseFormField) => (value: string) => {
    setData(field, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (files.length + data.documents.length > 5) {
        setDocumentsError('You can only upload up to 5 documents.');
        return;
      }
      setDocumentsError('');
      const newFiles = [...data.documents, ...files].slice(0, 5);
      setData('documents', newFiles);
      const titles = newFiles.map((file, index) => {
        const existingTitle = data.document_titles[index] || '';
        return existingTitle || file.name.replace(/\.[^/.]+$/, '');
      });
      setData('document_titles', titles);
    } else {
      setData('documents', []);
      setData('document_titles', []);
      setDocumentsError('');
    }
  };

  const handleTitleChange = (index: number, title: string) => {
    const newTitles = [...data.document_titles];
    newTitles[index] = title;
    setData('document_titles', newTitles);
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
    post(route('agents:institutions:courses:store', { institution: institution.id }), {
      forceFormData: true,
      onSuccess: () => router.visit(route('agents:institutions:show', institution.id)),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Add Course for ${institution.institution_name}`} />
      <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Add Course" description={`Create a new course for ${institution.institution_name}`} />
          </div>
          <Link href={route('agents:institutions:show', institution.id)} className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Institution
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
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Enter the main details for this course</p>
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
                  <Input value={data.campus_location} onChange={handleInputChange('campus_location')} required />
                  {errors.campus_location && <div className="text-red-500">{errors.campus_location}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Awarding Body</Label>
                  <Input value={data.awarding_body} onChange={handleInputChange('awarding_body')} />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !data.start_date && 'text-muted-foreground',
                        )}
                        type="button"
                      >
                        {data.start_date
                          ? format(new Date(data.start_date), 'dd MMM yyyy')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                      <Calendar
                        mode="single"
                        selected={data.start_date ? new Date(data.start_date) : undefined}
                        month={startCalendarMonth}
                        onMonthChange={setStartCalendarMonth}
                        onSelect={(date) => {
                          setData('start_date', date ? format(date, 'yyyy-MM-dd') : '');
                          if (date) setStartDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.start_date && <div className="text-red-500">{errors.start_date}</div>}
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !data.end_date && 'text-muted-foreground',
                        )}
                        type="button"
                      >
                        {data.end_date
                          ? format(new Date(data.end_date), 'dd MMM yyyy')
                          : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                      <Calendar
                        mode="single"
                        selected={data.end_date ? new Date(data.end_date) : undefined}
                        month={endCalendarMonth}
                        onMonthChange={setEndCalendarMonth}
                        onSelect={(date) => {
                          setData('end_date', date ? format(date, 'yyyy-MM-dd') : '');
                          if (date) setEndDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.end_date && <div className="text-red-500">{errors.end_date}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Duration (Year/Month/Week) <span className="text-red-600">*</span></Label>
                  <div className="flex gap-2">
                    <Select value={data.duration_year} onValueChange={handleSelectChange('duration_year')}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(6)].map((_, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return <SelectItem key={val} value={val}>{val}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                    <Select value={data.duration_month} onValueChange={handleSelectChange('duration_month')}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(11)].map((_, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return <SelectItem key={val} value={val}>{val}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                    <Select value={data.duration_week} onValueChange={handleSelectChange('duration_week')}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Week" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(51)].map((_, i) => {
                          const val = (i + 1).toString().padStart(2, '0');
                          return <SelectItem key={val} value={val}>{val}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 w-fit">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Financial Information</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Cost details and financial requirements</p>
                </div>
              </div>
            </CardHeader>
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
                <div className="space-y-2">
                  <Label>Monthly Living Cost</Label>
                  <Input type="number" value={data.monthly_living_cost} onChange={handleInputChange('monthly_living_cost')} />
                </div>
                <div className="space-y-2">
                  <Label>Part Time Work Details</Label>
                  <Textarea value={data.part_time_work_details} onChange={handleInputChange('part_time_work_details')} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 w-fit">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Requirements & Benefits</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Eligibility, benefits, and language requirements</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course Benefits</Label>
                  <Textarea value={data.course_benefits} onChange={handleInputChange('course_benefits')} />
                </div>
                <div className="space-y-2">
                  <Label>General Eligibility</Label>
                  <Textarea value={data.general_eligibility} onChange={handleInputChange('general_eligibility')} />
                </div>
                <div className="space-y-2">
                  <Label>Quality of Applicant Desired <span className="text-red-600">*</span></Label>
                  <Select value={data.quality_of_applicant} onValueChange={handleSelectChange('quality_of_applicant')} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent(****)</SelectItem>
                      <SelectItem value="good">Good(***)</SelectItem>
                      <SelectItem value="average">Average(**)</SelectItem>
                      <SelectItem value="below_average">Below Average(*)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.quality_of_applicant && <div className="text-red-500">{errors.quality_of_applicant}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Is Language Mandatory?</Label>
                  <Switch className="block" checked={data.is_language_mandatory} onCheckedChange={(checked: boolean) => setData('is_language_mandatory', checked)} />
                </div>
                <div className="space-y-2">
                  <Label>Language Requirements {data.is_language_mandatory && <span className="text-red-600">*</span>}</Label>
                  <Textarea value={data.language_requirements} onChange={handleInputChange('language_requirements')} required={!!data.is_language_mandatory} />
                  {data.is_language_mandatory && errors.language_requirements && <div className="text-red-500">{errors.language_requirements}</div>}
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

          {/* Intake Months Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0 w-fit">
                  <CalendarIcon className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Intake Months</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Select all intake months for this course</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MultiSelect
                options={[
                  { label: 'January', value: 'January' },
                  { label: 'February', value: 'February' },
                  { label: 'March', value: 'March' },
                  { label: 'April', value: 'April' },
                  { label: 'May', value: 'May' },
                  { label: 'June', value: 'June' },
                  { label: 'July', value: 'July' },
                  { label: 'August', value: 'August' },
                  { label: 'September', value: 'September' },
                  { label: 'October', value: 'October' },
                  { label: 'November', value: 'November' },
                  { label: 'December', value: 'December' },
                ]}
                onValueChange={vals => setData('intake_month', vals)}
                defaultValue={[]}
                placeholder="Select Intake Months"
                maxCount={12}
                value={data.intake_month}
              />
              {errors.intake_month && <div className="text-red-500">{errors.intake_month}</div>}
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0 w-fit">
                  <Folder className="w-4 h-4 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Documents & Files</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Upload course documents and files</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="documents" className="text-sm font-medium">
                  Documents (PDF, JPG, PNG, DOC, DOCX)
                </Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition bg-white w-full"
                  onClick={() => documentsInputRef.current?.click()}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload documents"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">Drag & drop files here or <span className="text-blue-600 underline">browse</span></span>
                  <input
                    ref={documentsInputRef}
                    type="file"
                    id="documents"
                    name="documents[]"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={data.documents.length >= 5}
                  />
                </div>
                {/* File list */}
                {data.documents.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {data.documents.map((file, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 rounded p-3 gap-2 sm:gap-0">
                        <div className="flex items-center">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 ml-0 sm:ml-3 w-full">
                          <div className="font-medium text-gray-800 truncate max-w-full break-all">{file.name}</div>
                          <Input
                            type="text"
                            placeholder="Enter document title (e.g., Transcript, Certificate, etc.)"
                            value={data.document_titles[idx] || ''}
                            onChange={e => handleTitleChange(idx, e.target.value)}
                            className="mt-1 text-sm w-full"
                          />
                          <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFile(idx)}
                          className="mt-2 sm:mt-0 sm:ml-2 text-red-500 hover:text-red-700"
                          aria-label="Remove file"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                {(errors.documents || documentsError) && (
                  <p className="text-sm text-red-600">{errors.documents || documentsError}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={processing}>Submit</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
