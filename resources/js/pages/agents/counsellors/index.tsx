import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { CounsellorResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Plus, Edit, Users, Check, Target, MessageSquare, Building2, User } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CounsellorRemark {
    id: string;
    remark: string;
    remark_date: string;
    remark_date_formatted: string;
    added_by_user: {
        id: string;
        name: string;
    };
    created_at: string;
    created_at_formatted: string;
    updated_at: string;
    updated_at_formatted: string;
}

interface Props {
  counsellors: CounsellorResource;
  counsellorsTotal: number;
  counsellorsActive: number;
  branches?: { id: string; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Counsellors', href: '/agents/counsellors' },
];

export default function CounsellorsIndex({ counsellors, counsellorsTotal, counsellorsActive }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [selectedCounsellor, setSelectedCounsellor] = useState<CounsellorResource['data'][0] | null>(null);
    const [remarks, setRemarks] = useState<CounsellorRemark[]>([]);
    const [isRemarksSheetOpen, setIsRemarksSheetOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        remark: '',
        remark_date: format(new Date(), 'yyyy-MM-dd'),
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleOpenRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        setSelectedCounsellor(counsellor);
        setIsRemarksSheetOpen(true);
        // Manual reset of form data
        setData('remark', '');
        setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
        console.log('Form reset when opening remarks sheet');
        // Fetch remarks for this counsellor
        await fetchRemarks(counsellor);
    };

    const handleSubmitRemark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCounsellor) return;

        post(route('agents:counsellors:remarks:store', { counsellor: selectedCounsellor.id }), {
            onSuccess: () => {
                // Manual reset of form data
                setData('remark', '');
                setData('remark_date', format(new Date(), 'yyyy-MM-dd'));
                console.log('Form reset after successful submission');
                // Add a small delay to ensure the data is saved before fetching
                setTimeout(() => {
                    fetchRemarks(selectedCounsellor);
                }, 500);
            },
        });
    };

    const fetchRemarks = async (counsellor: CounsellorResource['data'][0]) => {
        try {
            console.log('Fetching remarks for counsellor:', counsellor.id);
            const response = await fetch(`/agents/counsellors/${counsellor.id}/remarks`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Remarks data received:', data);
            setRemarks(data.data || []);
            console.log('Remarks state updated with:', data.data || []);
        } catch (error) {
            console.error('Error fetching remarks:', error);
            setRemarks([]);
        }
    };



    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Counsellors" />
            <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                        <Heading title="Counsellors" description="Manage your counsellors and their contact information" />
                    </div>
                    <Link href={route('agents:counsellors:create')} className="w-full sm:w-auto">
                        <Button className="w-full cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Counsellor
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatsCard
                        icon={<Users className="h-4 w-4 text-blue-600" aria-label="Total counsellors icon" />}
                        label="Total Counsellors"
                        value={counsellorsTotal}
                        bgColor="bg-blue-100"
                        iconAriaLabel="Total counsellors icon"
                    />
                    <StatsCard
                        icon={<Check className="h-4 w-4 text-green-600" aria-label="Active counsellors icon" />}
                        label="Active"
                        value={counsellorsActive}
                        bgColor="bg-green-100"
                        iconAriaLabel="Active counsellors icon"
                    />
                </div>

                {/* Counsellors Grid */}
                {counsellors.data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {counsellors.data.map((counsellor) => (
                            <Card key={counsellor.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    {/* Counsellor Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Users className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-sm">{counsellor.user.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    Added {format(new Date(counsellor.created_at), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusSwitch
                                            id={counsellor.id}
                                            checked={counsellor.is_active}
                                            route={route('agents:counsellors:toggle-status', { counsellor: counsellor.id })}
                                        />
                                    </div>

                                    {/* Essential Information */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span className="font-medium truncate max-w-[120px]" title={counsellor.user.email}>
                                                {counsellor.user.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Branch:</span>
                                            <span className="font-medium">{counsellor.branch.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Last Login:</span>
                                            <span className="font-medium">
                                                {counsellor.user.last_login_at
                                                    ? format(new Date(counsellor.user.last_login_at), 'MMM dd, yyyy HH:mm')
                                                    : 'Never'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-3 border-t space-y-2">
                                        {/* Primary Actions */}
                                        <div className="flex justify-between items-center">
                                            <Link href={route('agents:counsellors:edit', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={route('agents:counsellors:assign-institutions', { counsellor: counsellor.id })}>
                                                <Button size="sm" variant="outline">
                                                    <Building2 className="h-3 w-3 mr-1" />
                                                    Assign Institutions
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Secondary Actions */}
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="flex-1">
                                                <Target className="h-3 w-3 mr-1" />
                                                Add Target
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1"
                                                onClick={() => handleOpenRemarks(counsellor)}
                                            >
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Add Remarks
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {counsellors.data.length === 0 && (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                                <Users className="text-muted-foreground h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No counsellors found</h3>
                            <p className="text-muted-foreground mb-4">Get started by adding your first counsellor</p>
                            <Link href={route('agents:counsellors:create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Counsellor
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Unified Remarks Sheet */}
                <Sheet open={isRemarksSheetOpen} onOpenChange={setIsRemarksSheetOpen}>
                    <SheetContent className="!w-[800px] sm:!w-[1000px] lg:!w-[1200px] !max-w-none">
                        <SheetHeader>
                            <SheetTitle className="text-lg sm:text-xl">Remarks for {selectedCounsellor?.user?.name}</SheetTitle>
                            <SheetDescription className="text-sm">
                                Add new remarks and view existing ones for this counsellor.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            {/* Add Remark Form */}
                            <div className="grid gap-3">
                                <h3 className="text-sm font-medium mb-3">Add New Remark</h3>
                                <form onSubmit={handleSubmitRemark} className="space-y-4">
                                    {/* Remark Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="remark_date">Remark Date <span className="text-red-600">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !data.remark_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.remark_date ? format(new Date(data.remark_date), 'PPP') : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.remark_date ? new Date(data.remark_date) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setData('remark_date', format(date, 'yyyy-MM-dd'));
                                                        }
                                                    }}
                                                    disabled={(date) => {
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        return date < today;
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.remark_date && (
                                            <p className="text-sm text-red-600">{errors.remark_date}</p>
                                        )}
                                    </div>

                                    {/* Remark Text */}
                                    <div className="space-y-2">
                                        <Label htmlFor="remark">Remark <span className="text-red-600">*</span></Label>
                                        <Textarea
                                            id="remark"
                                            name="remark"
                                            value={data.remark}
                                            onChange={handleInput}
                                            placeholder="Enter your remark about this counsellor..."
                                            rows={4}
                                            maxLength={1000}
                                            required
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Maximum 1000 characters</span>
                                            <span>{data.remark.length}/1000</span>
                                        </div>
                                        {errors.remark && (
                                            <p className="text-sm text-red-600">{errors.remark}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Adding Remark...' : 'Add Remark'}
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* Remarks Table */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Existing Remarks</h3>
                                {remarks.length > 0 ? (
                                    <div className="w-full rounded border border-border bg-background shadow-sm overflow-x-auto">
                                        <div className="min-w-[600px] flex items-center px-2 sm:px-4 py-2 font-semibold text-gray-700 border-b text-xs sm:text-sm">
                                            <div className="w-24">Date</div>
                                            <div className="flex-1">Remark</div>
                                            <div className="w-32">Added By</div>
                                            <div className="w-32">Created</div>
                                            <div className="w-32">Updated</div>
                                        </div>
                                        {remarks.map((remark) => (
                                            <div key={remark.id} className="flex items-center px-2 sm:px-4 py-3 border-b last:border-b-0 text-xs sm:text-sm hover:bg-gray-50">
                                                <div className="w-24 font-medium">
                                                    {remark.remark_date_formatted}
                                                </div>
                                                <div className="flex-1 pr-4">
                                                    <div className="text-sm leading-relaxed">
                                                        {remark.remark}
                                                    </div>
                                                </div>
                                                <div className="w-32">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <User className="h-3 w-3" />
                                                        {remark.added_by_user.name}
                                                    </div>
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {remark.created_at_formatted}
                                                </div>
                                                <div className="w-32 text-muted-foreground">
                                                    {remark.updated_at_formatted}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                            <MessageSquare className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mb-2 text-base font-medium text-gray-900">No remarks found</h3>
                                        <p className="text-sm text-gray-500">
                                            Add your first remark using the form above.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
