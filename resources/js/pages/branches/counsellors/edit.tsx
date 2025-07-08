import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const downloadCsvOptions = [
  { value: 'allowed', label: 'Allowed' },
  { value: 'allowed_without_contact', label: 'Allowed without contact' },
  { value: 'not_allowed', label: 'Not allowed' },
];

interface Props {
  counsellor: any;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/branch-office/dashboard' },
  { title: 'Counsellors', href: '/branch-office/counsellors' },
  { title: 'Edit Counsellor', href: '' },
];

export default function EditCounsellor({ counsellor }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: counsellor.user.name,
    email: counsellor.user.email,
    password: '',
    password_confirmation: '',
    phone: counsellor.user.phone || '',
    mobile: counsellor.user.mobile || '',
    whatsapp: counsellor.user.whatsapp || '',
    download_csv: typeof counsellor.user.download_csv === 'string' ? counsellor.user.download_csv : 'not_allowed',
    as_processing_officer: counsellor.as_processing_officer as boolean,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSelect = (name: keyof typeof data, value: string) => {
    setData(name, value);
  };

  const handleCheckbox = (name: keyof typeof data, checked: boolean) => {
    setData(name, checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('branches:counsellors:update', { counsellor: counsellor.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Counsellor" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Edit Counsellor" description="Update counsellor information and permissions." />
          </div>
          <Link href="/branch-office/counsellors" className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Counsellors
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Person Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Person Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Person Name <span className="text-red-600">*</span></Label>
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
                <Input name="mobile" value={data.mobile} onChange={handleInput} />
                {errors.mobile && <p className="text-sm text-red-600">{errors.mobile}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input name="whatsapp" value={data.whatsapp} onChange={handleInput} />
                {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Assignment & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="download_csv">Download CSV <span className="text-red-600">*</span></Label>
                <Select value={data.download_csv} onValueChange={v => handleSelect('download_csv', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                    {downloadCsvOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.download_csv && <p className="text-sm text-red-600">{errors.download_csv}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="as_processing_officer">Role Type</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="as_processing_officer"
                    checked={data.as_processing_officer}
                    onCheckedChange={(checked) => handleCheckbox('as_processing_officer', checked as boolean)}
                  />
                  <Label htmlFor="as_processing_officer" className="text-sm font-normal">
                    Assign as Processing Officer
                  </Label>
                </div>
                {errors.as_processing_officer && <p className="text-sm text-red-600">{errors.as_processing_officer}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Login Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Login Detail</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (User Name) <span className="text-red-600">*</span></Label>
                <Input name="email" type="email" value={data.email} onChange={handleInput} required />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
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
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input name="password_confirmation" type="password" placeholder='Confirm Password' value={data.password_confirmation} onChange={handleInput} />
                {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Counsellor'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
} 