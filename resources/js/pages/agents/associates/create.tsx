import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm, Head } from '@inertiajs/react';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Branch, BreadcrumbItem, Country } from '@/types';

const categoryOptions = [
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
];
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Associates',
        href: '/agents/associates',
    },
    {
        title: 'Add Associate',
        href: '/agents/associates/create',
    }
];

interface Props{
    branches?: Branch[];
    countries?: Country[];
}

export default function CreateAssociate({branches, countries}: Props) {
  const [branchesState, setBranchesState] = useState<Branch[]>([]);
  const [countriesState, setCountriesState] = useState<Country[]>([]);
  const { data, setData, post, processing, errors, reset } = useForm({
    associate_name: '',
    branch_id: '',
    address: '',
    city: '',
    state: '',
    country_id: '',
    phone: '',
    website: '',
    category: '',
    term_of_association: '',
    contact_person: '',
    designation: '',
    contact_phone: '',
    contact_mobile: '',
    contact_skype: '',
    contact_email: '',
    password: '',
    password_confirmation: '',
  });
  const contractFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (branches) setBranchesState(branches);
    if (countries) setCountriesState(countries);
  }, [branches, countries]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  const handleSelect = (name: keyof typeof data, value: string) => {
    setData(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    (Object.entries(data) as [keyof typeof data, string][]).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (contractFileRef.current && contractFileRef.current.files && contractFileRef.current.files[0]) {
      formData.append('contract_term_file', contractFileRef.current.files[0]);
    }
    post(route('agents:associates:store'), {
      ...formData,
      forceFormData: true,
      onSuccess: () => {
        if (contractFileRef.current) contractFileRef.current.value = '';
        reset();
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Associate" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0 mb-2">
          <div className="flex-1 min-w-0">
            <Heading title="Add Associate" description="Create a new associate and assign them to a branch." />
          </div>
          <Link href={route('agents:associates:index')} className="w-full sm:w-auto">
            <Button variant="outline" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Associates
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Associate Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch_id">Select Branch</Label>
                <Select value={data.branch_id} onValueChange={v => handleSelect('branch_id', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesState.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch_id && <p className="text-sm text-red-600">{errors.branch_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="associate_name">Associate Name *</Label>
                <Input name="associate_name" value={data.associate_name} onChange={handleInput} required />
                {errors.associate_name && <p className="text-sm text-red-600">{errors.associate_name}</p>}
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
                <Label htmlFor="country_id">Country *</Label>
                <Select value={data.country_id} onValueChange={v => handleSelect('country_id', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesState.map(country => (
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
                <Label htmlFor="category">Category *</Label>
                <Select value={data.category} onValueChange={v => handleSelect('category', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="term_of_association">Term Of Association</Label>
                <textarea name="term_of_association" value={data.term_of_association} onChange={handleInput} className="w-full border rounded px-3 py-2" />
                {errors.term_of_association && <p className="text-sm text-red-600">{errors.term_of_association}</p>}
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="contract_term_file">Upload Contract Term</Label>
                <Input type="file" name="contract_term_file" ref={contractFileRef} />
                {/* contract_term_file errors are handled by backend flash or global error */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Point Of Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input name="contact_person" value={data.contact_person} onChange={handleInput} required />
                {errors.contact_person && <p className="text-sm text-red-600">{errors.contact_person}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input name="designation" value={data.designation} onChange={handleInput} required />
                {errors.designation && <p className="text-sm text-red-600">{errors.designation}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input name="contact_phone" value={data.contact_phone} onChange={handleInput} />
                {errors.contact_phone && <p className="text-sm text-red-600">{errors.contact_phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_mobile">Mobile *</Label>
                <Input name="contact_mobile" value={data.contact_mobile} onChange={handleInput} required />
                {errors.contact_mobile && <p className="text-sm text-red-600">{errors.contact_mobile}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_skype">Skype Id</Label>
                <Input name="contact_skype" value={data.contact_skype} onChange={handleInput} />
                {errors.contact_skype && <p className="text-sm text-red-600">{errors.contact_skype}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email Id *</Label>
                <Input name="contact_email" value={data.contact_email} onChange={handleInput} required />
                {errors.contact_email && <p className="text-sm text-red-600">{errors.contact_email}</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Login Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input name="password" type="password" value={data.password} onChange={handleInput} required />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password *</Label>
                <Input name="password_confirmation" type="password" value={data.password_confirmation} onChange={handleInput} required />
                {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
