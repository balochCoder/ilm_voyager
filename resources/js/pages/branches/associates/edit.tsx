import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useForm, Head } from '@inertiajs/react';
import { Edit, ArrowLeft, Info, FileText, ImageIcon, FileIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AssociateResource } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
];

interface Props {
    associate: AssociateResource['data'][0];
    countries: { id: string; name: string; flag?: string }[];
}

export default function BranchAssociateEdit({ associate, countries }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: associate.user?.name || '',
        associate_name: (associate as any).associate_name || '',
        address: (associate as any).address || '',
        city: (associate as any).city || '',
        state: (associate as any).state || '',
        country_id: associate.country_id || '',
        phone: associate.phone || '',
        website: (associate as any).website || '',
        category: associate.category || 'all',
        term_of_association: (associate as any).term_of_association || '',
        contact_person: (associate as any).contact_person || '',
        designation: (associate as any).designation || '',
        contact_phone: (associate as any).contact_phone || '',
        contact_mobile: (associate as any).contact_mobile || '',
        contact_skype: (associate as any).contact_skype || '',
        contact_email: (associate as any).contact_email || '',
        password: '',
        password_confirmation: '',
        contract_file: null as File | null,
        whatsapp: associate.whatsapp || '',
    });

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            toast.error('Please fix the errors in the form.');
        }
    }, [errors]);

    function getFileIcon(file: File) {
        const type = file.type;
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
        if (type.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
        if (type.includes('word')) return <FileText className="h-5 w-5 text-blue-700" />;
        return <FileIcon className="h-5 w-5 text-gray-400" />;
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    const handleSelect = (name: keyof typeof data, value: string) => {
        setData(name, value);
    };

    const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData(field as keyof typeof data, e.target.files[0]);
        } else {
            setData(field as keyof typeof data, null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('branches:associates:update', { associate: associate.id }));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/branch-office/dashboard' },
            { title: 'Associates', href: '/branch-office/associates' },
            { title: 'Edit Associate', href: `/branch-office/associates/${associate.id}/edit` },
        ]}>
            <Head title="Edit Associate" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title="Edit Associate" description="Edit this associate's details." />
                    </div>
                    <Link href={route('branches:associates:index')} className="w-full sm:w-auto">
                        <Button variant="default" className="cursor-pointer w-full">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Associates
                        </Button>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Associate Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Associate Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                                <Input name="name" value={data.name} onChange={handleInput} required />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input name="phone" value={data.phone} onChange={handleInput} />
                                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input name="mobile" value={data.contact_mobile} onChange={handleInput} />
                                {errors.contact_mobile && <p className="text-sm text-red-600">{errors.contact_mobile}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input name="whatsapp" value={data.whatsapp} onChange={handleInput} />
                                {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={data.category} onValueChange={(v) => handleSelect('category', v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="contract_file" className="text-sm font-medium">
                                    Contract Copy (PDF, JPG, PNG)
                                </Label>
                                <div className="relative flex flex-col rounded-lg border-2 border-dashed border-gray-300 bg-white p-3">
                                    <Input
                                        type="file"
                                        id="contract_file"
                                        name="contract_file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange('contract_file')}
                                        className="flex-1 cursor-pointer"
                                    />
                                    {data.contract_file && (
                                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                                            {getFileIcon(data.contract_file)}
                                            <span className="max-w-[220px] truncate sm:max-w-[320px]">{data.contract_file.name}</span>
                                        </div>
                                    )}
                                </div>
                                {errors.contract_file && <p className="text-sm text-red-600">{errors.contract_file}</p>}
                            </div>
                            <div className="space-y-2 md:col-span-3">
                                <Label htmlFor="term_of_association">Term Of Association</Label>
                                <Textarea
                                    name="term_of_association"
                                    value={data.term_of_association}
                                    onChange={handleInput}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {errors.term_of_association && <p className="text-sm text-red-600">{errors.term_of_association}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Point Of Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Point Of Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="contact_person">Contact Person <span className="text-red-600">*</span></Label>
                                <Input name="contact_person" value={data.contact_person} onChange={handleInput} required />
                                {errors.contact_person && <p className="text-sm text-red-600">{errors.contact_person}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation <span className="text-red-600">*</span></Label>
                                <Input name="designation" value={data.designation} onChange={handleInput} required />
                                {errors.designation && <p className="text-sm text-red-600">{errors.designation}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Phone</Label>
                                <Input name="contact_phone" value={data.contact_phone} onChange={handleInput} />
                                {errors.contact_phone && <p className="text-sm text-red-600">{errors.contact_phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_mobile">Mobile <span className="text-red-600">*</span></Label>
                                <Input name="contact_mobile" value={data.contact_mobile} onChange={handleInput} required />
                                {errors.contact_mobile && <p className="text-sm text-red-600">{errors.contact_mobile}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_skype">Skype Id</Label>
                                <Input name="contact_skype" value={data.contact_skype} onChange={handleInput} />
                                {errors.contact_skype && <p className="text-sm text-red-600">{errors.contact_skype}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Contact Email Id <span className="text-red-600">*</span></Label>
                                <Input name="contact_email" value={data.contact_email} onChange={handleInput} required />
                                {errors.contact_email && <p className="text-sm text-red-600">{errors.contact_email}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Login Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Login Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email Address (User Name) *</Label>
                                <Input name="contact_email" type="email" value={data.contact_email} onChange={handleInput} required />
                                {errors.contact_email && <p className="text-sm text-red-600">{errors.contact_email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="flex items-center gap-1">
                                    Password
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-3 w-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Leave blank to keep current password</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Input name="password" type="password" placeholder='Password' value={data.password} onChange={handleInput} />
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Associate
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 