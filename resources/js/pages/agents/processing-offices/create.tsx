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
  { title: 'Processing Offices', href: '/agents/processing-offices' },
  { title: 'Add Processing Office', href: '/agents/processing-offices/create' },
];

export default function CreateProcessingOffice(props: { timeZones?: { id: string; label: string }[], countries?: { id: string; name: string; flag?: string }[] }) {
  const { data, setData, post, processing, errors } = useForm({
    // Processing Office fields
    name: '',
    address: '',
    city: '',
    state: '',
    country_id: '',
    time_zone_id: '',
    phone: '',
    whatsapp: '',
    // User fields
    contact_name: '',
    user_email: '',
    password: '',
    password_confirmation: '',
    designation: '',
    user_phone: '',
    mobile: '',
    skype: '',
    download_csv: 'allowed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('agents:processing-offices:store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Processing Office" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Add Processing Office" description="Create a new processing office and assign a point of contact." />
          </div>
          <Link href="/agents/processing-offices" className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Processing Offices
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Processing Office Information */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Office Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Processing Office Name <span className="text-red-600">*</span></Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter processing office name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  placeholder="Enter address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  placeholder="Enter city"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={data.state}
                  onChange={(e) => setData('state', e.target.value)}
                  placeholder="Enter state"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_id">Country <span className="text-red-600">*</span></Label>
                <Select value={data.country_id} onValueChange={(value) => setData('country_id', value)}>
                  <SelectTrigger className={errors.country_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.countries?.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.flag && <img src={country.flag} alt="" className="inline w-4 h-4 mr-2" />}
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country_id && <p className="text-sm text-red-500">{errors.country_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_zone_id">Time Zone <span className="text-red-600">*</span></Label>
                <Select value={data.time_zone_id} onValueChange={(value) => setData('time_zone_id', value)}>
                  <SelectTrigger className={errors.time_zone_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.timeZones?.map((timeZone) => (
                      <SelectItem key={timeZone.id} value={timeZone.id}>
                        {timeZone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time_zone_id && <p className="text-sm text-red-500">{errors.time_zone_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={data.whatsapp}
                  onChange={(e) => setData('whatsapp', e.target.value)}
                  placeholder="Enter WhatsApp number"
                  className={errors.whatsapp ? 'border-red-500' : ''}
                />
                {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="download_csv">Download CSV <span className="text-red-600">*</span></Label>
                <Select value={data.download_csv} onValueChange={(value) => setData('download_csv', value)}>
                  <SelectTrigger className={errors.download_csv ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {downloadCsvOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.download_csv && <p className="text-sm text-red-500">{errors.download_csv}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Point of Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Point of Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person <span className="text-red-600">*</span></Label>
                <Input
                  id="contact_name"
                  value={data.contact_name}
                  onChange={(e) => setData('contact_name', e.target.value)}
                  placeholder="Enter contact person name"
                  className={errors.contact_name ? 'border-red-500' : ''}
                />
                {errors.contact_name && <p className="text-sm text-red-500">{errors.contact_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={data.designation}
                  onChange={(e) => setData('designation', e.target.value)}
                  placeholder="Enter designation"
                  className={errors.designation ? 'border-red-500' : ''}
                />
                {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_phone">Phone</Label>
                <Input
                  id="user_phone"
                  value={data.user_phone}
                  onChange={(e) => setData('user_phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.user_phone ? 'border-red-500' : ''}
                />
                {errors.user_phone && <p className="text-sm text-red-500">{errors.user_phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile <span className="text-red-600">*</span></Label>
                <Input
                  id="mobile"
                  value={data.mobile}
                  onChange={(e) => setData('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                  className={errors.mobile ? 'border-red-500' : ''}
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skype">Skype</Label>
                <Input
                  id="skype"
                  value={data.skype}
                  onChange={(e) => setData('skype', e.target.value)}
                  placeholder="Enter Skype ID"
                  className={errors.skype ? 'border-red-500' : ''}
                />
                {errors.skype && <p className="text-sm text-red-500">{errors.skype}</p>}
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
                <Label htmlFor="user_email">Email Address (Username) <span className="text-red-600">*</span></Label>
                <Input
                  id="user_email"
                  type="email"
                  value={data.user_email}
                  onChange={(e) => setData('user_email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.user_email ? 'border-red-500' : ''}
                />
                {errors.user_email && <p className="text-sm text-red-500">{errors.user_email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-600">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Enter password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password <span className="text-red-600">*</span></Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Confirm password"
                  className={errors.password_confirmation ? 'border-red-500' : ''}
                />
                {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create Processing Office'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
