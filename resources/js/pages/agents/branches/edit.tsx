import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const downloadCsvOptions = [
  { value: 'allowed', label: 'Allowed' },
  { value: 'allowed_without_contact', label: 'Allowed without contact' },
  { value: 'not_allowed', label: 'Not allowed' },
];

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country_id: string;
  time_zone_id: string;
  phone: string;
  website: string;
  email: string;
  user: {
    name: string;
    email: string;
    designation: string;
    phone: string;
    mobile: string;
    whatsapp: string;
    skype: string;
    download_csv: string;
  };
  contact_person_name: string;
  contact_person_email: string;
  contact_person_mobile: string;
}

interface Props {
  branch: Branch;
  timeZones?: { id: string; label: string }[];
  countries?: { id: string; name: string; flag?: string }[];
}

export default function EditBranch({ branch, timeZones: propsTimeZones, countries: propsCountries }: Props) {
  const [timeZones, setTimeZones] = useState<{ id: string; label: string }[]>([]);
  const [countries, setCountries] = useState<{ id: string; name: string; flag?: string }[]>([]);

  const { data, setData, put, processing, errors } = useForm({
    name: branch.name,
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    country_id: branch.country_id || '',
    time_zone_id: branch.time_zone_id || '',
    phone: branch.phone || '',
    website: branch.website || '',
    email: branch.email || '',
    contact_name: branch.user?.name || branch.contact_person_name || '',
    user_email: branch.user?.email || branch.contact_person_email || '',
    designation: branch.user?.designation || '',
    user_phone: branch.user?.phone || '',
    mobile: branch.user?.mobile || branch.contact_person_mobile || '',
    whatsapp: branch.user?.whatsapp || '',
    skype: branch.user?.skype || '',
    download_csv: branch.user?.download_csv || 'not_allowed',
    password: '',
    password_confirmation: '',
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Branches', href: '/agents/branches' },
    { title: 'Edit Branch', href: `/agents/branches/${branch.id}/edit` },
  ];

  useEffect(() => {
    if (propsTimeZones) {
      setTimeZones(propsTimeZones);
    } else {
      fetch('/api/time-zones')
        .then(res => res.json())
        .then(zones => setTimeZones(zones));
    }
  }, [propsTimeZones]);

  useEffect(() => {
    if (propsCountries) {
      setCountries(propsCountries);
    } else {
      fetch('/api/countries')
        .then(res => res.json())
        .then(countries => setCountries(countries));
    }
  }, [propsCountries]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.name as keyof typeof data, e.target.value);
  };

  const handleSelect = (name: keyof typeof data, value: string) => {
    setData(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('agents:branches:update', { branch: branch.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Branch" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Edit Branch" description="Update branch information and contact details." />
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
                <Label htmlFor="country_id">Country <span className="text-red-600">*</span></Label>
                <Select value={data.country_id} onValueChange={v => setData('country_id', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.flag && <img src={country.flag} alt="" className="inline w-4 h-4 mr-2" />}
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country_id && <p className="text-sm text-red-600">{errors.country_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_zone_id">Time Zone <span className="text-red-600">*</span></Label>
                <Select value={data.time_zone_id} onValueChange={v => setData('time_zone_id' as keyof typeof data, v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Time Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.id} value={tz.id}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time_zone_id && <p className="text-sm text-red-600">{errors.time_zone_id}</p>}
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Leave blank to keep current password</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  name="password"
                  type="password"
                  value={data.password}
                  onChange={handleInput}
                  placeholder='Password'
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                <Input
                  name="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={handleInput}
                  placeholder="Confirm new password"
                />
                {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Branch'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
