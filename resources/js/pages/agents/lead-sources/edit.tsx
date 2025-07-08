import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import React from 'react';

interface LeadSource {
    id: string;
    name: string;
    is_active: boolean;
    deleted_at: string | null;
}

interface Props {
    leadSource: LeadSource;
}

export default function EditLeadSource({ leadSource }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: leadSource.name || '',
        is_active: leadSource.is_active,
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof typeof data, e.target.value);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('is_active', e.target.checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('agents:lead-sources:update', { leadSource: leadSource.id }));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/agents/dashboard' },
                { title: 'Lead Sources', href: '/agents/lead-sources' },
                { title: 'Edit', href: '#' },
            ]}
        >
            <Head title="Edit Lead Source" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Edit Lead Source" description="Update lead source information." />
                    </div>
                    <Link href="/agents/lead-sources" className="w-full sm:w-auto">
                        <Button variant="default" className="w-full cursor-pointer">
                            Back to Lead Sources
                        </Button>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Source Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name <span className="text-red-600">*</span>
                                </Label>
                                <Input name="name" value={data.name} onChange={handleInput} required />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-2">
                        <Button type="submit" variant="default" disabled={processing}>
                            Save
                        </Button>
                        {leadSource.deleted_at && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.post(route('agents:lead-sources:restore', { id: leadSource.id }))}
                            >
                                Restore
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
