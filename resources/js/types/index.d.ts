import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
    roles?: string[]; // Roles that can access this item
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash?: {
        success?: string;
    };
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export type Email = {
    address: string;
    verified: boolean;
};
export interface User {
    id: number;
    name: string;
    email: Email;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[]; // Assuming roles are stored as an array of strings
    [key: string]: unknown; // This allows for additional properties...
}
export interface Country {
    id: string;
    name: string;
    flag: string;
}

export interface Status {
    id: string;
    name: string;
    color: string;
    order: number;
    pivot?: {
        notes: string | null;
        completed_at: string | null;
        is_current: boolean;
        order: number;
    };
}

export interface RepCountry {
    id: string;
    monthly_living_cost: string | null;
    visa_requirements: string | null;
    part_time_work_details: string | null;
    country_benefits: string | null;
    is_active: boolean;
    country: Country;
    statuses?: Status[];
    current_status?: Status;
    created: {
        human: string;
        string: string;
    };
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    has_more_pages: boolean;
    has_previous_page: boolean;
}
export interface Status {
    id: string;
    name: string;
}
