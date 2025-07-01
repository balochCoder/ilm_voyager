import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Currency, RepCountry } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Building2, DollarSign, FileText, Globe, Plus, Upload, Users, Trash2, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    institution: any;
    repCountries: RepCountry[];
    currencies: Currency[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/representing-institutions' },
    { title: 'Edit Institution', href: '#' },
];

function getFileIcon(file: File) {
    const type = file.type;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-700" />;
    return <FileIcon className="h-5 w-5 text-gray-400" />;
}

export default function EditInstitution({ institution, repCountries, currencies }: Props) {
    const initialFormState = {
        rep_country_id: institution.rep_country_id ? String(institution.rep_country_id) : '',
        institution_name: institution.institution_name || '',
        campus: institution.campus || '',
        website: institution.website || '',
        monthly_living_cost: institution.monthly_living_cost || '',
        funds_required_for_visa: institution.funds_required_for_visa || '',
        application_fee: institution.application_fee || '',
        currency_id: institution.currency_id ? String(institution.currency_id) : '',
        contract_terms: institution.contract_terms || '',
        institute_type: institution.institute_type || '',
        quality_of_desired_application: institution.quality_of_desired_application || '',
        contract_expiry_date: institution.contract_expiry_date || '',
        is_language_mandatory: institution.is_language_mandatory || false,
        language_requirements: institution.language_requirements || '',
        institutional_benefits: institution.institutional_benefits || '',
        part_time_work_details: institution.part_time_work_details || '',
        scholarship_policy: institution.scholarship_policy || '',
        institution_status_notes: institution.institution_status_notes || '',
        contact_person_name: institution.contact_person_name || '',
        contact_person_email: institution.contact_person_email || '',
        contact_person_mobile: institution.contact_person_mobile || '',
        contact_person_designation: institution.contact_person_designation || '',
        contract_copy: null as File | null,
        logo: null as File | null,
        prospectus: null as File | null,
        additional_files: [] as File[],
        additional_file_titles: [] as string[],
        is_active: institution.is_active,
        _method: 'PUT',
    };
    const { data, setData, post, processing, errors } = useForm(initialFormState);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState<Date>(
        data.contract_expiry_date ? new Date(data.contract_expiry_date) : new Date()
    );
    const [additionalFilesError, setAdditionalFilesError] = useState('');
    const additionalFilesInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data.contract_expiry_date) {
            setCalendarMonth(new Date(data.contract_expiry_date));
        }
    }, [data.contract_expiry_date]);

    const handleInputChange = (field: keyof typeof initialFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(field, e.target.value);
    };

    const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (field === 'additional_files') {
                const files = Array.from(e.target.files);
                if (files.length + data.additional_files.length > 2) {
                    setAdditionalFilesError('You can only upload up to 2 files.');
                    return;
                }
                setAdditionalFilesError('');
                const newFiles = [...data.additional_files, ...files].slice(0, 2);
                setData('additional_files', newFiles);
                // Initialize titles for new files
                const titles = newFiles.map((file, index) => {
                    const existingTitle = data.additional_file_titles[index] || '';
                    return existingTitle || file.name.replace(/\.[^/.]+$/, ''); // Remove extension
                });
                setData('additional_file_titles', titles);
            } else {
                setData(field as keyof typeof data, e.target.files[0]);
            }
        } else {
            // Handle case when files are cleared
            if (field === 'additional_files') {
                setData('additional_files', []);
                setData('additional_file_titles', []);
                setAdditionalFilesError('');
            } else {
                setData(field as keyof typeof data, null);
            }
        }
    };

    const handleTitleChange = (index: number, title: string) => {
        const newTitles = [...data.additional_file_titles];
        newTitles[index] = title;
        setData('additional_file_titles', newTitles);
    };

    const removeFile = (index: number) => {
        const newFiles = [...data.additional_files];
        const newTitles = [...data.additional_file_titles];
        newFiles.splice(index, 1);
        newTitles.splice(index, 1);
        setData('additional_files', newFiles);
        setData('additional_file_titles', newTitles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:institutions:update', { institution: institution.id }), {
            forceFormData: true,
        });
    };

    // Drag and drop handlers
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            if (files.length + data.additional_files.length > 2) {
                setAdditionalFilesError('You can only upload up to 2 files.');
                return;
            }
            setAdditionalFilesError('');
            const newFiles = [...data.additional_files, ...files].slice(0, 2);
            setData('additional_files', newFiles);
            const titles = newFiles.map((file, index) => {
                const existingTitle = data.additional_file_titles[index] || '';
                return existingTitle || file.name.replace(/\.[^/.]+$/, '');
            });
            setData('additional_file_titles', titles);
        }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const selectedRepCountry = repCountries.find((rc) => rc.id === data.rep_country_id);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Institution" />
            <div className="flex h-full flex-1 flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title="Edit Institution" description='Update institution details and documentation' />
                    </div>
                    <Link href={route('agents:institutions:show', { institution: institution.id })} className="w-full sm:w-auto">
                        <Button variant="default" className="cursor-pointer w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Institution
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 min-w-0">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 w-fit">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Institution details and basic configuration</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="rep_country_id" className="text-sm font-medium">
                                        Country <span className="text-red-600">*</span>
                                    </Label>
                                    <Select value={data.rep_country_id} onValueChange={(v: string) => setData('rep_country_id', v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {repCountries.map((rc) => (
                                                <SelectItem key={rc.id} value={rc.id}>
                                                    <div className="flex items-center">
                                                        <img src={rc.country.flag} alt={rc.country.name} className="mr-2 h-3 w-4 rounded" />
                                                        {rc.country.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.rep_country_id && <p className="text-sm text-red-600">{errors.rep_country_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution_name" className="text-sm font-medium">
                                        Institution Name <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        id="institution_name"
                                        value={data.institution_name}
                                        onChange={handleInputChange('institution_name')}
                                        placeholder="Enter institution name"
                                    />
                                    {errors.institution_name && <p className="text-sm text-red-600">{errors.institution_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institute_type" className="text-sm font-medium">
                                        Institute Type <span className="text-red-600">*</span>
                                    </Label>
                                    <Select value={data.institute_type} onValueChange={(v:string) => setData('institute_type', v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="direct">Direct</SelectItem>
                                            <SelectItem value="indirect">Indirect</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.institute_type && <p className="text-sm text-red-600">{errors.institute_type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quality_of_desired_application" className="text-sm font-medium">
                                        Quality of Desired Application <span className="text-red-600">*</span>
                                    </Label>
                                    <Select
                                        value={data.quality_of_desired_application}
                                        onValueChange={(v:string) => setData('quality_of_desired_application', v)}
                                    >
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
                                    {errors.quality_of_desired_application && (
                                        <p className="text-sm text-red-600">{errors.quality_of_desired_application}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="campus" className="text-sm font-medium">
                                        Campus
                                    </Label>
                                    <Input
                                        id="campus"
                                        value={data.campus}
                                        onChange={handleInputChange('campus')}
                                        placeholder="Enter campus location"
                                    />
                                    {errors.campus && <p className="text-sm text-red-600">{errors.campus}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-sm font-medium">
                                        Website <span className="text-red-600">*</span>
                                    </Label>
                                    <Input
                                        type="url"
                                        id="website"
                                        value={data.website}
                                        onChange={handleInputChange('website')}
                                        placeholder="https://example.com"
                                    />
                                    {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency_id" className="text-sm font-medium">
                                        Currency <span className="text-red-600">*</span>
                                    </Label>
                                    <Select value={data.currency_id} onValueChange={(v: string) => setData('currency_id', v)}>
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
                                    {errors.currency_id && <p className="text-sm text-red-600">{errors.currency_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contract_expiry_date" className="text-sm font-medium">
                                        Contract Expiry Date
                                    </Label>
                                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal',
                                                    !data.contract_expiry_date && 'text-muted-foreground',
                                                )}
                                                type="button"
                                            >
                                                {data.contract_expiry_date
                                                    ? format(new Date(data.contract_expiry_date), 'dd MMM yyyy')
                                                    : 'Pick a date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start" side="bottom" avoidCollisions={false}>
                                            <Calendar
                                                mode="single"
                                                selected={data.contract_expiry_date ? new Date(data.contract_expiry_date) : undefined}
                                                month={calendarMonth}
                                                onMonthChange={setCalendarMonth}
                                                onSelect={(date) => {
                                                    setData('contract_expiry_date', date ? format(date, 'yyyy-MM-dd') : '');
                                                    if (date) setDatePickerOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.contract_expiry_date && <p className="text-sm text-red-600">{errors.contract_expiry_date}</p>}
                                </div>
                            </div>

                            {selectedRepCountry && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <div className="flex min-w-0 flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                        <img
                                            src={selectedRepCountry.country.flag}
                                            alt={selectedRepCountry.country.name}
                                            className="h-6 w-8 flex-shrink-0 rounded shadow-sm"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-medium text-blue-900 sm:text-base">
                                                {selectedRepCountry.country.name} selected
                                            </h3>
                                            <p className="text-xs text-blue-700 sm:text-sm">
                                                Institution will be associated with {selectedRepCountry.country.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_living_cost" className="text-sm font-medium">
                                        Monthly Living Cost
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        id="monthly_living_cost"
                                        value={data.monthly_living_cost}
                                        onChange={handleInputChange('monthly_living_cost')}
                                        placeholder="0.00"
                                    />
                                    {errors.monthly_living_cost && <p className="text-sm text-red-600">{errors.monthly_living_cost}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="funds_required_for_visa" className="text-sm font-medium">
                                        Funds Required for Visa
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        id="funds_required_for_visa"
                                        value={data.funds_required_for_visa}
                                        onChange={handleInputChange('funds_required_for_visa')}
                                        placeholder="0.00"
                                    />
                                    {errors.funds_required_for_visa && <p className="text-sm text-red-600">{errors.funds_required_for_visa}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="application_fee" className="text-sm font-medium">
                                        Application Fee
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        id="application_fee"
                                        value={data.application_fee}
                                        onChange={handleInputChange('application_fee')}
                                        placeholder="0.00"
                                    />
                                    {errors.application_fee && <p className="text-sm text-red-600">{errors.application_fee}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language Requirements Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 w-fit">
                                    <Globe className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Language Requirements</CardTitle>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Language prerequisites and requirements</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={data.is_language_mandatory}
                                        onCheckedChange={(checked: boolean) => setData('is_language_mandatory', checked)}
                                    />
                                    <Label className="text-sm font-medium">Is Language Mandatory?</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language_requirements" className="text-sm font-medium">
                                        Language Requirements
                                    </Label>
                                    <Textarea
                                        id="language_requirements"
                                        value={data.language_requirements}
                                        onChange={handleInputChange('language_requirements')}
                                        placeholder="Enter language requirements, test scores needed, exemptions, and any special conditions..."
                                        rows={3}
                                        className="resize-none"
                                    />
                                    {errors.language_requirements && <p className="text-sm text-red-600">{errors.language_requirements}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Information Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 w-fit">
                                        <FileText className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl">Contract & Terms</CardTitle>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Contract terms and institutional policies</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_terms" className="text-sm font-medium">
                                            Contract Terms
                                        </Label>
                                        <Textarea
                                            id="contract_terms"
                                            value={data.contract_terms}
                                            onChange={handleInputChange('contract_terms')}
                                            placeholder="Enter contract terms, conditions, obligations, and any special clauses..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                        {errors.contract_terms && <p className="text-sm text-red-600">{errors.contract_terms}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="institutional_benefits" className="text-sm font-medium">
                                            Institutional Benefits
                                        </Label>
                                        <Textarea
                                            id="institutional_benefits"
                                            value={data.institutional_benefits}
                                            onChange={handleInputChange('institutional_benefits')}
                                            placeholder="Enter benefits offered by the institution, facilities, services, and advantages..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                        {errors.institutional_benefits && <p className="text-sm text-red-600">{errors.institutional_benefits}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="part_time_work_details" className="text-sm font-medium">
                                            Part Time Work Details
                                        </Label>
                                        <Textarea
                                            id="part_time_work_details"
                                            value={data.part_time_work_details}
                                            onChange={handleInputChange('part_time_work_details')}
                                            placeholder="Enter part-time work opportunities, restrictions, hours allowed, and job types..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                        {errors.part_time_work_details && <p className="text-sm text-red-600">{errors.part_time_work_details}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scholarship_policy" className="text-sm font-medium">
                                            Scholarship Policy
                                        </Label>
                                        <Textarea
                                            id="scholarship_policy"
                                            value={data.scholarship_policy}
                                            onChange={handleInputChange('scholarship_policy')}
                                            placeholder="Enter scholarship opportunities, eligibility criteria, application process, and amounts..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                        {errors.scholarship_policy && <p className="text-sm text-red-600">{errors.scholarship_policy}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="institution_status_notes" className="text-sm font-medium">
                                            Institution Status Notes (for Counsellor)
                                        </Label>
                                        <Textarea
                                            id="institution_status_notes"
                                            value={data.institution_status_notes}
                                            onChange={handleInputChange('institution_status_notes')}
                                            placeholder="Enter internal notes, status updates, special instructions for counsellors..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                        {errors.institution_status_notes && <p className="text-sm text-red-600">{errors.institution_status_notes}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                                    <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0 w-fit">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Primary contact person details</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_person_name" className="text-sm font-medium">
                                            Contact Person Name <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            id="contact_person_name"
                                            value={data.contact_person_name}
                                            onChange={handleInputChange('contact_person_name')}
                                            placeholder="Enter contact person name"
                                        />
                                        {errors.contact_person_name && <p className="text-sm text-red-600">{errors.contact_person_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_person_email" className="text-sm font-medium">
                                            Contact Person Email <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            id="contact_person_email"
                                            value={data.contact_person_email}
                                            onChange={handleInputChange('contact_person_email')}
                                            placeholder="contact@institution.com"
                                        />
                                        {errors.contact_person_email && <p className="text-sm text-red-600">{errors.contact_person_email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_person_mobile" className="text-sm font-medium">
                                            Contact Person Mobile <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            id="contact_person_mobile"
                                            value={data.contact_person_mobile}
                                            onChange={handleInputChange('contact_person_mobile')}
                                            placeholder="Enter mobile number"
                                        />
                                        {errors.contact_person_mobile && <p className="text-sm text-red-600">{errors.contact_person_mobile}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_person_designation" className="text-sm font-medium">
                                            Contact Person Designation <span className="text-red-600">*</span>
                                        </Label>
                                        <Input
                                            id="contact_person_designation"
                                            value={data.contact_person_designation}
                                            onChange={handleInputChange('contact_person_designation')}
                                            placeholder="Enter designation"
                                        />
                                        {errors.contact_person_designation && (
                                            <p className="text-sm text-red-600">{errors.contact_person_designation}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 min-w-0">
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0 w-fit">
                                        <Upload className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl">Documents & Files</CardTitle>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Upload institution documents and files</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="contract_copy" className="text-sm font-medium">
                                            Contract Copy (PDF, JPG, PNG)
                                        </Label>
                                        <div className="relative flex flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-white">
                                            {institution.contract_copy && !data.contract_copy && (
                                                <div className="mb-2 p-3 rounded-lg border border-blue-300 bg-blue-50 flex items-center gap-3 shadow-sm">
                                                    <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-semibold text-blue-700 mb-1">Current Contract Copy</div>
                                                        <a href={institution.contract_copy.url} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline font-medium">
                                                            {institution.contract_copy.name}
                                                        </a>
                                                        <span className="ml-2 text-xs text-gray-500">({(institution.contract_copy.size / 1024).toFixed(1)} KB)</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                id="contract_copy"
                                                name="contract_copy"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange('contract_copy')}
                                                className="flex-1 cursor-pointer"
                                            />
                                            {data.contract_copy && (
                                                <div className="ml-2 flex items-center gap-1 text-green-600 text-sm">
                                                    {getFileIcon(data.contract_copy)}
                                                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{data.contract_copy.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.contract_copy && <p className="text-sm text-red-600">{errors.contract_copy}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="logo" className="text-sm font-medium">
                                            Logo (JPG, PNG, SVG)
                                        </Label>
                                        <div className="relative flex flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-white">
                                            {institution.logo_url && !data.logo && (
                                                <div className="mb-2 p-3 rounded-lg border border-green-300 bg-green-50 flex items-center gap-3 shadow-sm">
                                                    <ImageIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-semibold text-green-700 mb-1">Current Logo</div>
                                                        <a href={institution.logo_url} target="_blank" rel="noopener noreferrer" className="text-green-900 hover:underline font-medium">
                                                            {institution.institution_name} Logo
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                id="logo"
                                                name="logo"
                                                accept=".jpg,.jpeg,.png,.svg"
                                                onChange={handleFileChange('logo')}
                                                className="flex-1 cursor-pointer"
                                            />
                                            {data.logo && (
                                                <div className="ml-2 flex items-center gap-1 text-green-600 text-sm">
                                                    {getFileIcon(data.logo)}
                                                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{data.logo.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.logo && <p className="text-sm text-red-600">{errors.logo}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prospectus" className="text-sm font-medium">
                                            Prospectus (PDF)
                                        </Label>
                                        <div className="relative flex flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 bg-white">
                                            {institution.prospectus && !data.prospectus && (
                                                <div className="mb-2 p-3 rounded-lg border border-purple-300 bg-purple-50 flex items-center gap-3 shadow-sm">
                                                    <FileText className="h-6 w-6 text-purple-500 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-semibold text-purple-700 mb-1">Current Prospectus</div>
                                                        <a href={institution.prospectus.url} target="_blank" rel="noopener noreferrer" className="text-purple-900 hover:underline font-medium">
                                                            {institution.prospectus.name}
                                                        </a>
                                                        <span className="ml-2 text-xs text-gray-500">({(institution.prospectus.size / 1024).toFixed(1)} KB)</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                id="prospectus"
                                                name="prospectus"
                                                accept=".pdf"
                                                onChange={handleFileChange('prospectus')}
                                                className="flex-1 cursor-pointer"
                                            />
                                            {data.prospectus && (
                                                <div className="ml-2 flex items-center gap-1 text-green-600 text-sm">
                                                    {getFileIcon(data.prospectus)}
                                                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{data.prospectus.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.prospectus && <p className="text-sm text-red-600">{errors.prospectus}</p>}
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="additional_files" className="text-sm font-medium">
                                            Additional Files (PDF, JPG, PNG, DOC, DOCX)
                                        </Label>
                                        {/* Existing files */}
                                        {institution.additional_files && institution.additional_files.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-xs font-semibold text-orange-700 mb-1">Current Additional Files</div>
                                                <ul className="space-y-2">
                                                    {institution.additional_files.map((file: any, idx: number) => (
                                                        <li key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50 shadow-sm">
                                                            <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-orange-900 hover:underline font-medium">
                                                                {file.title || file.name}
                                                            </a>
                                                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <div
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition bg-white w-full"
                                            onClick={() => additionalFilesInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            tabIndex={0}
                                            role="button"
                                            aria-label="Upload additional files"
                                        >
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-gray-600 font-medium">Drag & drop files here or <span className="text-blue-600 underline">browse</span></span>
                                            <input
                                                ref={additionalFilesInputRef}
                                                type="file"
                                                id="additional_files"
                                                name="additional_files[]"
                                                multiple
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                onChange={handleFileChange('additional_files')}
                                                className="hidden"
                                                disabled={data.additional_files.length + (institution.additional_files?.length || 0) >= 2}
                                            />
                                        </div>
                                        {/* New files to upload */}
                                        {data.additional_files.length > 0 && (
                                            <ul className="mt-4 space-y-2">
                                                {data.additional_files.map((file, idx) => (
                                                    <li key={idx} className="flex flex-col sm:flex-row sm:items-center bg-gray-50 rounded p-3 gap-2 sm:gap-0">
                                                        <div className="flex items-center">
                                                            {getFileIcon(file)}
                                                        </div>
                                                        <div className="flex-1 ml-0 sm:ml-3 w-full">
                                                            <div className="font-medium text-gray-800 truncate max-w-full break-all">{file.name}</div>
                                                            <Input
                                                                type="text"
                                                                placeholder="Enter document title (e.g., Transcript, Certificate, etc.)"
                                                                value={data.additional_file_titles[idx] || ''}
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
                                        {(errors.additional_files || additionalFilesError) && (
                                            <p className="text-sm text-red-600">{errors.additional_files || additionalFilesError}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 sm:pt-6 border-t space-y-4 sm:space-y-0 min-w-0">
                        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                            <span className="font-medium">{repCountries.length}</span> representing countries available for selection
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                            <Link href={route('agents:institutions:index')} className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="min-w-[180px] w-full sm:w-auto">
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
