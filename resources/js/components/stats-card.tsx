import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    bgColor: string;
    iconAriaLabel?: string;
}

export default function StatsCard({ icon, label, value, bgColor, iconAriaLabel }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${bgColor}`}
                         aria-label={iconAriaLabel || undefined}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
                        <p className="text-xl sm:text-2xl font-semibold">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}