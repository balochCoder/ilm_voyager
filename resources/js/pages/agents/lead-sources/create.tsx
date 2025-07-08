import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link, useForm, Head } from '@inertiajs/react';
import React from 'react';

export default function CreateLeadSource() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        is_active: true,
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof typeof data, e.target.value);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('is_active', e.target.checked);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('agents:lead-sources:store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/agents/dashboard' }, { title: 'Lead Sources', href: '/agents/lead-sources' }, { title: 'Create', href: '#' }] }>
            <Head title="Create Lead Source" />
            <div className="flex flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                        <Heading title="Create Lead Source" description="Add a new lead source." />
                    </div>
                    <Link href="/agents/lead-sources" className="w-full sm:w-auto">
                        <Button variant="default" className="cursor-pointer w-full">Back to Lead Sources</Button>
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Source Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                                <Input name="name" value={data.name} onChange={handleInput} required />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                           
                        </CardContent>
                    </Card>
                    <div className="flex gap-2">
                        <Button type="submit" variant="default" disabled={processing}>Create</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
