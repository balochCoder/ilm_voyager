import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const downloadCsvOptions = [
  { value: 'allowed', label: 'Allowed' },
  { value: 'allowed_without_contact', label: 'Allowed without contact' },
  { value: 'not_allowed', label: 'Not allowed' },
];

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Branches', href: '/agents/branches' },
  { title: 'Add Branch', href: '/agents/branches/create' },
];

export default function CreateBranch() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    timezone: '',
    phone: '',
    website: '',
    email: '',
    contact_name: '',
    user_email: '',
    password: '',
    password_confirmation: '',
    designation: '',
    user_phone: '',
    mobile: '',
    whatsapp: '',
    skype: '',
    download_csv: 'not_allowed',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.name, e.target.value);
  };

  const handleSelect = (name: keyof typeof data, value: string) => {
    setData(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('agents:branches:store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Branch" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Add Branch" description="Create a new branch and assign a point of contact." />
          </div>
          <Link href="/agents/branches" className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Branches
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch Information */}
          <Card>
            <CardHeader>
              <CardTitle>Branch Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name <span className="text-red-600">*</span></Label>
                <Input name="name" value={data.name} onChange={handleInput} required />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input name="address" value={data.address} onChange={handleInput} />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input name="city" value={data.city} onChange={handleInput} />
                {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input name="state" value={data.state} onChange={handleInput} />
                {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country <span className="text-red-600">*</span></Label>
                <Input name="country" value={data.country} onChange={handleInput} required />
                {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time zone</Label>
                <Input name="timezone" value={data.timezone} onChange={handleInput} />
                {errors.timezone && <p className="text-sm text-red-600">{errors.timezone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input name="phone" value={data.phone} onChange={handleInput} />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input name="website" value={data.website} onChange={handleInput} />
                {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" value={data.email} onChange={handleInput} />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
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
            </CardContent>
          </Card>

          {/* Point Of Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Point Of Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person <span className="text-red-600">*</span></Label>
                <Input name="contact_name" value={data.contact_name} onChange={handleInput} required />
                {errors.contact_name && <p className="text-sm text-red-600">{errors.contact_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input name="designation" value={data.designation} onChange={handleInput} />
                {errors.designation && <p className="text-sm text-red-600">{errors.designation}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_phone">Phone</Label>
                <Input name="user_phone" value={data.user_phone} onChange={handleInput} />
                {errors.user_phone && <p className="text-sm text-red-600">{errors.user_phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile <span className="text-red-600">*</span></Label>
                <Input name="mobile" value={data.mobile} onChange={handleInput} required />
                {errors.mobile && <p className="text-sm text-red-600">{errors.mobile}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input name="whatsapp" value={data.whatsapp} onChange={handleInput} />
                {errors.whatsapp && <p className="text-sm text-red-600">{errors.whatsapp}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="skype">Skype</Label>
                <Input name="skype" value={data.skype} onChange={handleInput} />
                {errors.skype && <p className="text-sm text-red-600">{errors.skype}</p>}
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
                <Label htmlFor="user_email">Email Address (User Name) <span className="text-red-600">*</span></Label>
                <Input name="user_email" value={data.user_email} onChange={handleInput} required />
                {errors.user_email && <p className="text-sm text-red-600">{errors.user_email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                <Input name="password" type="password" value={data.password} onChange={handleInput} required />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password <span className="text-red-600">*</span></Label>
                <Input name="password_confirmation" type="password" value={data.password_confirmation} onChange={handleInput} required />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
