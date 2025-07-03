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
}

export interface SubStatus {
    id: number;
    name: string;
    description?: string | null;
    is_completed: boolean;
    completed_at?: string | null;
    order: number;
    is_active: boolean;
    created_at?: {
        human: string;
        string: string;
    } | null;
    updated_at?: {
        human: string;
        string: string;
    } | null;
}

export interface RepCountryStatus {
    id: int;
    status_name: string;
    order: number;
    notes?: string | null;
    completed_at?: string | null;
    is_current?: boolean;
    is_active?: boolean;
    sub_statuses?: SubStatus[];
    created_at?: {
        human: string;
        string: string;
    } | null;
    updated_at?: {
        human: string;
        string: string;
    } | null;
}

export interface RepCountry {
    id: string;
    monthly_living_cost: string | null;
    visa_requirements: string | null;
    part_time_work_details: string | null;
    country_benefits: string | null;
    is_active: boolean;
    country: Country;
    statuses?: RepCountryStatus[];
    current_status?: RepCountryStatus | null;
    created: {
        human: string;
        string: string;
    };
    updated: {
        human: string;
        string: string;
    };
}

export interface RepCountryResource {
    data: RepCountry[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}



export interface Currency {
    id: number;
    code: string;
    name: string;

}

export interface Institution {
    id: string;
    rep_country_id: string;
    institution_name: string;
    campus?: string | null;
    website?: string | null;
    monthly_living_cost?: string | null;
    funds_required_for_visa?: string | null;
    application_fee?: string | null;
    currency_id: number;
    contract_terms?: string | null;
    institute_type: 'direct' | 'indirect';
    quality_of_desired_application: 'excellent' | 'good' | 'average' | 'below_average';
    contract_expiry_date?: string | null;
    is_language_mandatory: boolean;
    language_requirements?: string | null;
    institutional_benefits?: string | null;
    part_time_work_details?: string | null;
    scholarship_policy?: string | null;
    institution_status_notes?: string | null;
    contact_person_name?: string | null;
    contact_person_email?: string | null;
    contact_person_mobile?: string | null;
    contact_person_designation?: string | null;
    is_active: boolean;
    created?: {
        human: string;
        string: string;
    };
    updated?: {
        human: string;
        string: string;
    };
    deleted_at?: string | null;
    rep_country?: RepCountry;
    currency?: Currency;
    logo_url?: string;
    contract_copy?: {
        id: number;
        name: string;
        url: string;
        size: number;
        mime_type: string;
    } | null;
    prospectus?: {
        id: number;
        name: string;
        url: string;
        size: number;
        mime_type: string;
    } | null;
    additional_files?: {
        id: number;
        name: string;
        title: string;
        url: string;
        size: number;
        mime_type: string;
    }[];
}

export interface InstitutionResource {
    data: Institution[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface CourseDocument {
    id: number;
    name: string;
    title: string;
    url: string;
    size: number;
    mime_type: string;
}

export interface Course {
    id: string | number;
    institution_id: string | number;
    title: string;
    course_level_id: string | number;
    course_level?: { id: string | number; name: string } | null;
    duration_year: string;
    duration_month: string;
    duration_week: string;
    start_date: string;
    end_date: string;
    campus: string;
    awarding_body: string;
    currency_id: string | number;
    currency?: { id: string | number; name: string; code: string } | null;
    course_fee: string;
    application_fee: string;
    course_benefits: string;
    general_eligibility: string;
    quality_of_desired_application: string;
    is_language_mandatory: boolean;
    language_requirements: string;
    additional_info: string;
    course_categories: string[];
    modules: string[];
    intake_month: string[];
    is_active: boolean;
    documents?: CourseDocument[];
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface CourseResource {
    data: Course[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
