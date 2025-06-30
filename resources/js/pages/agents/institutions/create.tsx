import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RepCountry, Currency } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Heading from '@/components/heading';

interface Props {
    repCountries: RepCountry[];
    currencies: Currency[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Institutions', href: '/agents/institutions' },
    { title: 'Add Institution', href: '/agents/institutions/create' },
];

export default function InstitutionsCreate({ repCountries, currencies }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        rep_country_id: '',
        institution_name: '',
        campus: '',
        website: '',
        monthly_living_cost: '',
        funds_required_for_visa: '',
        application_fee: '',
        currency_id: '',
        contract_terms: '',
        institute_type: '',
        quality_of_desired_application: '',
        contract_expiry_date: '',
        is_language_mandatory: false,
        language_requirements: '',
        institutional_benefits: '',
        part_time_work_details: '',
        scholarship_policy: '',
        institution_status_notes: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_mobile: '',
        contact_person_designation: '',
        is_active: true,
        contract_copy: null as File | null,
        logo: null as File | null,
        prospectus: null as File | null,
        additional_files: [] as File[],
        additional_file_titles: [] as string[],
    });

    const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (field === 'additional_files') {
                const files = Array.from(e.target.files);
                setData('additional_files', files);
                // Initialize titles for new files
                const titles = files.map((file, index) => {
                    // Try to get existing title or generate default
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

        // Debug: Log the form data
        console.log('Form data before submission:', data);
        console.log('Additional files:', data.additional_files);

        post(route('agents:institutions:store'), {
            forceFormData: true,
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            onSuccess: () => {
                console.log('Form submitted successfully');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Institution" />
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
                <Heading title="Add Institution" />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Institution Name *</Label>
                        <Input value={data.institution_name} onChange={e => setData('institution_name', e.target.value)} />
                        {errors.institution_name && <div className="text-red-500 text-sm">{errors.institution_name}</div>}
                    </div>

                    <div>
                        <Label>Rep Country *</Label>
                        <Select value={data.rep_country_id} onValueChange={v => setData('rep_country_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select rep country" />
                            </SelectTrigger>
                            <SelectContent>
                                {repCountries.map(rc => (
                                    <SelectItem key={rc.id} value={rc.id}>{rc.country.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.rep_country_id && <div className="text-red-500 text-sm">{errors.rep_country_id}</div>}
                    </div>

                    <div>
                        <Label>Institute Type *</Label>
                        <Select value={data.institute_type} onValueChange={v => setData('institute_type', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="direct">Direct</SelectItem>
                                <SelectItem value="indirect">Indirect</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.institute_type && <div className="text-red-500 text-sm">{errors.institute_type}</div>}
                    </div>

                    <div>
                        <Label>Quality of Desired Application *</Label>
                        <Select value={data.quality_of_desired_application} onValueChange={v => setData('quality_of_desired_application', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="average">Average</SelectItem>
                                <SelectItem value="below_average">Below Average</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.quality_of_desired_application && <div className="text-red-500 text-sm">{errors.quality_of_desired_application}</div>}
                    </div>

                    <div>
                        <Label>Campus</Label>
                        <Input value={data.campus} onChange={e => setData('campus', e.target.value)} />
                        {errors.campus && <div className="text-red-500 text-sm">{errors.campus}</div>}
                    </div>

                    <div>
                        <Label>Website</Label>
                        <Input type="url" value={data.website} onChange={e => setData('website', e.target.value)} />
                        {errors.website && <div className="text-red-500 text-sm">{errors.website}</div>}
                    </div>

                    <div>
                        <Label>Currency *</Label>
                        <Select value={data.currency_id} onValueChange={v => setData('currency_id', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map(cur => (
                                    <SelectItem key={cur.id} value={cur.id.toString()}>{cur.name} ({cur.code})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.currency_id && <div className="text-red-500 text-sm">{errors.currency_id}</div>}
                    </div>

                    <div>
                        <Label>Contract Expiry Date</Label>
                        <Input type="date" value={data.contract_expiry_date} onChange={e => setData('contract_expiry_date', e.target.value)} />
                        {errors.contract_expiry_date && <div className="text-red-500 text-sm">{errors.contract_expiry_date}</div>}
                    </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Monthly Living Cost</Label>
                        <Input type="number" step="0.01" value={data.monthly_living_cost} onChange={e => setData('monthly_living_cost', e.target.value)} />
                        {errors.monthly_living_cost && <div className="text-red-500 text-sm">{errors.monthly_living_cost}</div>}
                    </div>

                    <div>
                        <Label>Funds Required for Visa</Label>
                        <Input type="number" step="0.01" value={data.funds_required_for_visa} onChange={e => setData('funds_required_for_visa', e.target.value)} />
                        {errors.funds_required_for_visa && <div className="text-red-500 text-sm">{errors.funds_required_for_visa}</div>}
                    </div>

                    <div>
                        <Label>Application Fee</Label>
                        <Input type="number" step="0.01" value={data.application_fee} onChange={e => setData('application_fee', e.target.value)} />
                        {errors.application_fee && <div className="text-red-500 text-sm">{errors.application_fee}</div>}
                    </div>
                </div>

                {/* Language Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={data.is_language_mandatory}
                            onCheckedChange={(checked) => setData('is_language_mandatory', checked)}
                        />
                        <Label>Is Language Mandatory?</Label>
                    </div>

                    <div className="md:col-span-2">
                        <Label>Language Requirements</Label>
                        <Textarea value={data.language_requirements} onChange={e => setData('language_requirements', e.target.value)} rows={3} />
                        {errors.language_requirements && <div className="text-red-500 text-sm">{errors.language_requirements}</div>}
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-4">
                    <div>
                        <Label>Contract Terms</Label>
                        <Textarea value={data.contract_terms} onChange={e => setData('contract_terms', e.target.value)} rows={4} />
                        {errors.contract_terms && <div className="text-red-500 text-sm">{errors.contract_terms}</div>}
                    </div>

                    <div>
                        <Label>Institutional Benefits</Label>
                        <Textarea value={data.institutional_benefits} onChange={e => setData('institutional_benefits', e.target.value)} rows={4} />
                        {errors.institutional_benefits && <div className="text-red-500 text-sm">{errors.institutional_benefits}</div>}
                    </div>

                    <div>
                        <Label>Part Time Work Details</Label>
                        <Textarea value={data.part_time_work_details} onChange={e => setData('part_time_work_details', e.target.value)} rows={4} />
                        {errors.part_time_work_details && <div className="text-red-500 text-sm">{errors.part_time_work_details}</div>}
                    </div>

                    <div>
                        <Label>Scholarship Policy</Label>
                        <Textarea value={data.scholarship_policy} onChange={e => setData('scholarship_policy', e.target.value)} rows={4} />
                        {errors.scholarship_policy && <div className="text-red-500 text-sm">{errors.scholarship_policy}</div>}
                    </div>

                    <div>
                        <Label>Institution Status Notes (for Counsellor)</Label>
                        <Textarea value={data.institution_status_notes} onChange={e => setData('institution_status_notes', e.target.value)} rows={4} />
                        {errors.institution_status_notes && <div className="text-red-500 text-sm">{errors.institution_status_notes}</div>}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Contact Person Name</Label>
                        <Input value={data.contact_person_name} onChange={e => setData('contact_person_name', e.target.value)} />
                        {errors.contact_person_name && <div className="text-red-500 text-sm">{errors.contact_person_name}</div>}
                    </div>

                    <div>
                        <Label>Contact Person Email</Label>
                        <Input type="email" value={data.contact_person_email} onChange={e => setData('contact_person_email', e.target.value)} />
                        {errors.contact_person_email && <div className="text-red-500 text-sm">{errors.contact_person_email}</div>}
                    </div>

                    <div>
                        <Label>Contact Person Mobile</Label>
                        <Input value={data.contact_person_mobile} onChange={e => setData('contact_person_mobile', e.target.value)} />
                        {errors.contact_person_mobile && <div className="text-red-500 text-sm">{errors.contact_person_mobile}</div>}
                    </div>

                    <div>
                        <Label>Contact Person Designation</Label>
                        <Input value={data.contact_person_designation} onChange={e => setData('contact_person_designation', e.target.value)} />
                        {errors.contact_person_designation && <div className="text-red-500 text-sm">{errors.contact_person_designation}</div>}
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label>Is Active</Label>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Contract Copy (PDF, JPG, PNG)</Label>
                        <Input type="file" name="contract_copy" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange('contract_copy')} />
                        {data.contract_copy && (
                            <div className="mt-1 text-sm text-green-600">
                                ✓ {data.contract_copy.name} selected
                            </div>
                        )}
                        {errors.contract_copy && <div className="text-red-500 text-sm">{errors.contract_copy}</div>}
                    </div>

                    <div>
                        <Label>Logo (JPG, PNG, SVG)</Label>
                        <Input type="file" name="logo" accept=".jpg,.jpeg,.png,.svg" onChange={handleFileChange('logo')} />
                        {data.logo && (
                            <div className="mt-1 text-sm text-green-600">
                                ✓ {data.logo.name} selected
                            </div>
                        )}
                        {errors.logo && <div className="text-red-500 text-sm">{errors.logo}</div>}
                    </div>

                    <div>
                        <Label>Prospectus (PDF)</Label>
                        <Input type="file" name="prospectus" accept=".pdf" onChange={handleFileChange('prospectus')} />
                        {data.prospectus && (
                            <div className="mt-1 text-sm text-green-600">
                                ✓ {data.prospectus.name} selected
                            </div>
                        )}
                        {errors.prospectus && <div className="text-red-500 text-sm">{errors.prospectus}</div>}
                    </div>

                    <div>
                        <Label>Additional Files (PDF, JPG, PNG, DOC, DOCX)</Label>
                        <Input type="file" name="additional_files[]" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange('additional_files')} />
                        {data.additional_files.length > 0 && (
                            <div className="mt-3 space-y-3">
                                <div className="text-sm text-green-600">
                                    ✓ {data.additional_files.length} file(s) selected:
                                </div>
                                {data.additional_files.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-700 mb-1">
                                                File {index + 1}: {file.name}
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="Enter document title (e.g., Transcript, Certificate, etc.)"
                                                value={data.additional_file_titles[index] || ''}
                                                onChange={(e) => handleTitleChange(index, e.target.value)}
                                                className="text-sm"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.additional_files && <div className="text-red-500 text-sm">{errors.additional_files}</div>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Institution'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
