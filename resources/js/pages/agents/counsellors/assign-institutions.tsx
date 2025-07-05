import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Building2, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Counsellor } from '@/types';

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Counsellors', href: '/agents/counsellors' },
  { title: 'Assign Institutions', href: '/agents/counsellors/assign-institutions' },
];

interface Props {
  counsellor: Counsellor;
  institutions: { id: string; institution_name: string }[];
}

export default function AssignInstitutions({ counsellor, institutions }: Props) {
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const { setData, post, processing } = useForm({
    counsellor_id: counsellor.id,
    institution_ids: [] as string[],
  });

  const handleInstitutionToggle = (institutionId: string) => {
    setSelectedInstitutions(prev => {
      if (prev.includes(institutionId)) {
        return prev.filter(id => id !== institutionId);
      } else {
        return [...prev, institutionId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('institution_ids', selectedInstitutions);
    post(route('agents:counsellors:assign-institutions-store', { counsellor: counsellor.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Assign Institutions" />
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <Heading title="Assign Institutions" description={`Assign institutions to ${counsellor.user.name}`} />
          </div>
          <Link href="/agents/counsellors" className="w-full sm:w-auto">
            <Button variant="default" className="cursor-pointer w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Counsellors
            </Button>
          </Link>
        </div>

        {/* Counsellor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Counsellor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <p className="text-sm">{counsellor.user.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <p className="text-sm">{counsellor.user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Branch:</span>
                <p className="text-sm">{counsellor.branch.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institutions Assignment */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Select Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {institutions.map((institution) => (
                  <div key={institution.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={institution.id}
                      checked={selectedInstitutions.includes(institution.id)}
                      onCheckedChange={() => handleInstitutionToggle(institution.id)}
                    />
                    <label
                      htmlFor={institution.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {institution.institution_name}
                    </label>
                  </div>
                ))}
              </div>

              {institutions.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No institutions available for assignment.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={processing}>
              {processing ? 'Assigning...' : 'Assign Institutions'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
