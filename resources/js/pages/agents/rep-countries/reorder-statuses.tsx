import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RepCountryStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GripVertical, ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    repCountry: {
        statuses: RepCountryStatus[];
        country: { name: string };
        id: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/agents/dashboard' },
    { title: 'Representing Countries', href: '/agents/representing-countries' },
    { title: 'Reorder Steps', href: '#' },
];

function SortableItem({ status, index }: { status: RepCountryStatus; index: number }) {
    const isNew = status.status_name === "New";
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: status.status_name, disabled: isNew });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isNew ? "not-allowed" : "move",
        backgroundColor: isNew ? "#f3f4f6" : undefined,
    };
    return (
        <div ref={setNodeRef} style={style} className="flex items-center space-x-3 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow" {...attributes} {...(isNew ? {} : listeners)}>
            <GripVertical className={`w-5 h-5 ${isNew ? "text-gray-300" : "text-gray-400"}`} />
            <div className="flex-1">
                <div className="font-medium text-gray-900">{status.status_name}</div>
                <div className="text-sm text-gray-500">Step {index + 1}</div>
            </div>
            {isNew && <span className="text-xs text-gray-400 ml-2">(Fixed)</span>}
        </div>
    );
}

export default function ReorderStatuses({ repCountry }: Props) {
    const [statuses, setStatuses] = useState<RepCountryStatus[]>(repCountry.statuses || []);
    const prevOrderRef = useRef<string[]>(statuses.map(s => s.status_name));
    useEffect(() => { prevOrderRef.current = statuses.map(s => s.status_name); }, [statuses]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const newIndex = statuses.findIndex(s => s.status_name === "New");
        if (!over || !active.id || active.id === statuses[newIndex]?.status_name) return;
        const overIndex = statuses.findIndex(s => s.status_name === over.id);
        if (overIndex === newIndex) return;
        setStatuses(items => {
            const oldIndex = items.findIndex(item => item.status_name === active.id);
            if (oldIndex === newIndex || overIndex === newIndex) return items;
            const newItems = arrayMove(items, oldIndex, overIndex);
            const prevOrder = prevOrderRef.current;
            const newOrder = newItems.map(s => s.status_name);
            const isSameOrder = prevOrder.length === newOrder.length && prevOrder.every((val, idx) => val === newOrder[idx]);
            if (!isSameOrder) {
                const statusOrder = newItems.map((status, index) => ({ status_name: status.status_name, order: index + 1 }));
                router.post(route('agents:rep-countries:save-status-order', repCountry.id), { status_order: statusOrder }, {
                    preserveScroll: true,
                    onSuccess: () => toast.success('Status order updated!'),
                    onError: errors => { toast.error('Failed to update status order'); console.error('Error updating status order:', errors); }
                });
                prevOrderRef.current = newOrder;
            }
            return newItems;
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reorder Steps" />
            <div className="flex h-full flex-1 flex-col p-4">
                <div className="flex justify-between items-center">
                    <Heading title={`Reorder Steps - ${repCountry.country.name}`} />
                    <Link href={route('agents:rep-countries:index')} prefetch>
                        <Button className='cursor-pointer' variant="neutral">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                </div>
                <Alert className="mb-6 mt-6">
                    <AlertDescription>
                        Drag and drop the statuses below to reorder the application process steps for {repCountry.country.name}.
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle>Reordering of Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={statuses.map(status => status.status_name)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                    {statuses.map((status, index) => (
                                        <SortableItem key={status.status_name} status={status} index={index} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {statuses.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No statuses found for this country.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
