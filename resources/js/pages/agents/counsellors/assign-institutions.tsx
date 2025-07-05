import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Building2, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Counsellor } from '@/types';

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Counsellors', href: '/agents/counsellors' },
  { title: 'Assign Institutions', href: '/agents/counsellors/assign-institutions' },
];

interface Props {
  counsellor: Counsellor;
  institutionsByCountry: Record<string, Array<{ id: string; institution_name: string; country_id: string }>>;
  assignedInstitutionIds: string[];
}

export default function AssignInstitutions({ counsellor, institutionsByCountry, assignedInstitutionIds }: Props) {
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(assignedInstitutionIds);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    counsellor_id: counsellor.id,
    institution_ids: [] as string[],
  });

  // Watch for changes in selectedInstitutions and update form data
  useEffect(() => {
    setData('institution_ids', selectedInstitutions);
  }, [selectedInstitutions, setData]);

  // Watch for shouldSubmit flag and submit form
  useEffect(() => {
    if (shouldSubmit) {
      console.log('Submitting form with data:', data);
      post(route('agents:counsellors:assign-institutions-store', { counsellor: counsellor.id }), {
        onError: (errors) => {
          console.error('Form submission errors:', errors);
          setShouldSubmit(false);
        },
        onSuccess: () => {
          console.log('Form submitted successfully');
          setShouldSubmit(false);
        },
      });
    }
  }, [shouldSubmit, data, post, counsellor.id]);

  const handleInstitutionToggle = (institutionId: string) => {
    setSelectedInstitutions(prev => {
      if (prev.includes(institutionId)) {
        return prev.filter(id => id !== institutionId);
      } else {
        return [...prev, institutionId];
      }
    });
  };

  const handleCountryToggle = (countryName: string) => {
    const countryInstitutions = institutionsByCountry[countryName] || [];
    const countryInstitutionIds = countryInstitutions.map(inst => inst.id);

    const allSelected = countryInstitutionIds.every(id => selectedInstitutions.includes(id));

    if (allSelected) {
      // If all are selected, unselect all
      setSelectedInstitutions(prev => prev.filter(id => !countryInstitutionIds.includes(id)));
    } else {
      // If not all are selected, select all
      setSelectedInstitutions(prev => {
        const newSelection = prev.filter(id => !countryInstitutionIds.includes(id));
        return [...newSelection, ...countryInstitutionIds];
      });
    }
  };

  const isCountrySelected = (countryName: string) => {
    const countryInstitutions = institutionsByCountry[countryName] || [];
    const countryInstitutionIds = countryInstitutions.map(inst => inst.id);
    return countryInstitutionIds.length > 0 && countryInstitutionIds.every(id => selectedInstitutions.includes(id));
  };

  const getCountrySelectionStatus = (countryName: string) => {
    const countryInstitutions = institutionsByCountry[countryName] || [];
    const countryInstitutionIds = countryInstitutions.map(inst => inst.id);
    const selectedCount = countryInstitutionIds.filter(id => selectedInstitutions.includes(id)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === countryInstitutionIds.length) return 'all';
    return 'partial';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button clicked, selected institutions:', selectedInstitutions);
    setShouldSubmit(true);
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
              <div className="space-y-6">
                {Object.entries(institutionsByCountry).map(([countryName, institutions]) => (
                  <div key={countryName} className="space-y-3">
                    {/* Country Header */}
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <Checkbox
                        id={`country-${countryName}`}
                        checked={isCountrySelected(countryName)}
                        onCheckedChange={() => handleCountryToggle(countryName)}
                      />
                      <label
                        htmlFor={`country-${countryName}`}
                        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {countryName} ({institutions.length} institutions)
                        {getCountrySelectionStatus(countryName) === 'partial' && (
                          <span className="text-xs text-muted-foreground ml-2">(Partially selected)</span>
                        )}
                      </label>
                    </div>

                    {/* Institutions under this country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                      {institutions.map((institution) => (
                        <div key={institution.id} className="flex items-center space-x-2 p-2 border rounded-lg">
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
                  </div>
                ))}
              </div>

              {Object.keys(institutionsByCountry).length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No institutions available for assignment.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {errors.institution_ids && (
            <div className="text-red-600 text-sm mt-2">
              {errors.institution_ids}
            </div>
          )}

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
