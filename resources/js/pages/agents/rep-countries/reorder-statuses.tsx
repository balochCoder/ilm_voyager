import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RepCountryStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ArrowLeft, ArrowUpDown, Info, CheckCircle, AlertCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    repCountry: {
        statuses: RepCountryStatus[];
        country: { name: string; flag?: string };
        id: string;
        is_active?: boolean;
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
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`flex items-center space-x-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                isNew ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:border-blue-300'
            } ${isDragging ? 'shadow-lg scale-105' : ''}`}
            {...attributes} 
            {...(isNew ? {} : listeners)}
        >
            {/* Step Number */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isNew ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'
            }`}>
                {index + 1}
            </div>

            {/* Grip Handle */}
            <div className={`p-1 rounded ${
                isNew ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}>
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${
                        isNew ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                        {status.status_name}
                    </h3>
                    {isNew && (
                        <Badge variant="neutral" className="text-xs">
                            Fixed Position
                        </Badge>
                    )}
                    {status.is_active !== false && (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Application step {index + 1}
                </p>
            </div>

            {/* Status Indicator */}
            {isNew && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <AlertCircle className="w-3 h-3" />
                    <span>Cannot move</span>
                </div>
            )}
        </div>
    );
}

export default function ReorderStatuses({ repCountry }: Props) {
    const [statuses, setStatuses] = useState<RepCountryStatus[]>(repCountry.statuses || []);
    const [isReordering, setIsReordering] = useState(false);
    const prevOrderRef = useRef<string[]>(statuses.map(s => s.status_name));
    
    useEffect(() => { 
        prevOrderRef.current = statuses.map(s => s.status_name); 
    }, [statuses]);

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

        setIsReordering(true);
        
        setStatuses(items => {
            const oldIndex = items.findIndex(item => item.status_name === active.id);
            if (oldIndex === newIndex || overIndex === newIndex) return items;
            
            const newItems = arrayMove(items, oldIndex, overIndex);
            const prevOrder = prevOrderRef.current;
            const newOrder = newItems.map(s => s.status_name);
            const isSameOrder = prevOrder.length === newOrder.length && prevOrder.every((val, idx) => val === newOrder[idx]);
            
            if (!isSameOrder) {
                const statusOrder = newItems.map((status, index) => ({ 
                    status_name: status.status_name, 
                    order: index + 1 
                }));
                
                router.post(route('agents:rep-countries:save-status-order', repCountry.id), { 
                    status_order: statusOrder 
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Application steps reordered successfully!');
                        setIsReordering(false);
                    },
                    onError: errors => { 
                        toast.error('Failed to update step order'); 
                        console.error('Error updating status order:', errors);
                        setIsReordering(false);
                    }
                });
                prevOrderRef.current = newOrder;
            }
            
            return newItems;
        });
    };

    const movableSteps = statuses.filter(s => s.status_name !== "New").length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reorder Steps" />
            <div className="flex h-full flex-1 flex-col p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <Heading title='Reorder Application Steps' />
                        <p className="text-muted-foreground mt-1">
                            Arrange the order of application process steps
                        </p>
                    </div>
                    <Link href={route('agents:rep-countries:index')}>
                        <Button variant="noShadow" className="cursor-pointer">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Countries
                        </Button>
                    </Link>
                </div>

                {/* Country Info Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            {repCountry.country?.flag && (
                                <img
                                    src={repCountry.country.flag}
                                    alt={repCountry.country.name}
                                    className="w-12 h-9 rounded shadow-sm"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {repCountry.country.name}
                                </h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant={repCountry.is_active ? "default" : "neutral"}>
                                        {repCountry.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                        <ArrowUpDown className="w-4 h-4" />
                                        <span>{statuses.length} application steps</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions Card */}
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Info className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-amber-900 mb-1">How to reorder steps</h3>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• Drag and drop the steps below to change their order</li>
                                    <li>• The "New" step is fixed at the beginning and cannot be moved</li>
                                    <li>• Changes are saved automatically when you reorder</li>
                                    <li>• The order determines the sequence of the application process</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reorder Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Application Steps Order</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {movableSteps} steps can be reordered • 1 step is fixed
                                </p>
                            </div>
                            {isReordering && (
                                <div className="flex items-center space-x-2 text-sm text-blue-600">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <span>Saving changes...</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DndContext 
                            sensors={sensors} 
                            collisionDetection={closestCenter} 
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={statuses.map(status => status.status_name)} 
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {statuses.map((status, index) => (
                                        <SortableItem 
                                            key={status.status_name} 
                                            status={status} 
                                            index={index} 
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        
                        {statuses.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <ArrowUpDown className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No steps found</h3>
                                <p className="text-muted-foreground">
                                    Add some application steps first to reorder them
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Current Order</h3>
                                    <p className="text-sm text-gray-600">
                                        {statuses.map((s, i) => s.status_name).join(' → ')}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                {statuses.length} Total Steps
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
