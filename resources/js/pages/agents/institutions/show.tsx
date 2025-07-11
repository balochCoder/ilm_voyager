import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { Institution } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Building2, Calendar, DollarSign, File, FileText, Globe, GraduationCap, Info, Landmark, Mail, Phone, User
} from 'lucide-react';

// Helper: Get initials from institution name
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper: Section title
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">{children}</h3>;
}

// Helper: Info row with icon, label, value
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="mt-1">{icon}</span>
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">{label}</div>
        <div className="text-base break-all text-gray-900">{value || <span className="text-gray-400">—</span>}</div>
      </div>
    </div>
  );
}

// Glassmorphic card wrapper
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mb-8 w-full rounded-2xl border border-primary/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

const tabs = [
  { key: 'overview', label: 'Overview', icon: <Info className="mr-1 h-4 w-4" /> },
  { key: 'contacts', label: 'Contacts', icon: <User className="mr-1 h-4 w-4" /> },
  { key: 'documents', label: 'Documents', icon: <FileText className="mr-1 h-4 w-4" /> },
];

const breadcrumbs = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Institutions', href: '/agents/representing-institutions' },
];

interface Props {
  institution: Institution | null;
}

export default function ShowInstitution({ institution }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  if (!institution) {
    return <div>Institution not found.</div>;
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Institution: ${institution.institution_name}`} />
      <div className="flex h-full w-full flex-1 flex-col space-y-4 p-2 sm:space-y-6 sm:p-4 md:p-6">
        {/* Top Bar: Heading and Back Button */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <Heading title="Institution Detail" description="Details of institutions" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Link href={route('agents:institutions:edit', { institution: institution.id })} className="w-full md:w-auto">
              <Button variant="outline" className="w-full cursor-pointer">
                Edit
              </Button>
            </Link>
            <Link href={route('agents:institutions:index')} className="w-full md:w-auto">
              <Button className="w-full cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Institutions
              </Button>
            </Link>
          </div>
        </div>
        {/* Hero Section */}
        <div className="mb-8 flex w-full flex-col items-center gap-6 sm:gap-8 md:flex-row">
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl shadow-lg border border-white/40 bg-white/60">
              {institution.logo_url ? (
                <AvatarImage src={institution.logo_url} alt="Logo" className="object-contain" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-4xl font-bold border border-primary/20">
                  {getInitials(institution.institution_name)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            <h2 className="mb-2 break-words whitespace-normal text-base sm:text-lg md:text-xl font-extrabold text-gray-900">{institution.institution_name}</h2>
            <div className="mb-3 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <Badge variant="secondary">
                {institution.institute_type?.charAt(0).toUpperCase() + institution.institute_type?.slice(1)}
              </Badge>
              {institution.rep_country?.country?.name && <Badge variant="outline">{institution.rep_country.country.name}</Badge>}
              <Badge variant={institution.is_active ? 'default' : 'destructive'}>{institution.is_active ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>
        </div>
        <Separator className="my-4 sm:my-6" />
        {/* Tabs Navigation */}
        <div className="mb-6 w-full overflow-x-auto">
          <div className="flex gap-2 rounded-xl border border-primary/20 bg-white/60 p-2 shadow backdrop-blur-xl min-w-[320px] sm:min-w-0">
            {tabs.map((tab) => (
              <Button
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                key={tab.key}
                className={`flex items-center font-medium rounded-full px-4 sm:px-5 py-2 transition-all focus:outline-none
                  ${activeTab === tab.key ? 'bg-primary text-white shadow font-semibold' : 'text-muted-foreground hover:bg-primary/10'}
                `}
                style={{ boxShadow: activeTab === tab.key ? '0 2px 8px 0 rgba(0,0,0,0.08)' : undefined }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <div className="w-full transition-all duration-300">
          {activeTab === 'overview' && (
            <GlassCard>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                <div>
                  <SectionTitle>Institution Details</SectionTitle>
                  <InfoRow
                    icon={<Globe className="text-primary" />}
                    label="Website"
                    value={
                      <a
                        href={institution.website || ''}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {institution.website}
                      </a>
                    }
                  />
                  <InfoRow icon={<Landmark className="text-primary" />} label="Campus" value={institution.campus} />
                  <InfoRow icon={<DollarSign className="text-primary" />} label="Monthly Living Cost" value={institution.monthly_living_cost} />
                  <InfoRow icon={<FileText className="text-primary" />} label="Funds Required for Visa" value={institution.funds_required_for_visa} />
                  <InfoRow icon={<FileText className="text-primary" />} label="Application Fee" value={institution.application_fee} />
                  <InfoRow icon={<Info className="text-primary" />} label="Currency" value={`${institution.currency?.name || ''} ${institution.currency?.code ? `(${institution.currency.code})` : ''}`} />
                  <InfoRow icon={<File className="text-primary" />} label="Contract Terms" value={institution.contract_terms} />
                  <InfoRow icon={<Calendar className="text-primary" />} label="Contract Expiry Date" value={institution.contract_expiry_date} />
                  <InfoRow icon={<GraduationCap className="text-primary" />} label="Is Language Mandatory?" value={institution.is_language_mandatory ? 'Yes' : 'No'} />
                  <InfoRow icon={<Info className="text-primary" />} label="Language Requirements" value={institution.language_requirements} />
                  <InfoRow icon={<Info className="text-primary" />} label="Institutional Benefits" value={institution.institutional_benefits} />
                  <InfoRow icon={<Info className="text-primary" />} label="Part Time Work Details" value={institution.part_time_work_details} />
                  <InfoRow icon={<Info className="text-primary" />} label="Scholarship Policy" value={institution.scholarship_policy} />
                  <InfoRow icon={<Info className="text-primary" />} label="Institution Status Note" value={institution.institution_status_notes} />
                </div>
                <div>
                  <SectionTitle>Meta</SectionTitle>
                  <InfoRow icon={<Calendar className="text-primary" />} label="Created" value={institution.created?.human} />
                  <InfoRow icon={<Calendar className="text-primary" />} label="Updated" value={institution.updated?.human} />
                </div>
              </div>
            </GlassCard>
          )}
          {activeTab === 'contacts' && (
            <GlassCard>
              <SectionTitle>Contact Details</SectionTitle>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                <InfoRow icon={<User className="text-primary" />} label="Contact Person" value={institution.contact_person_name} />
                <InfoRow icon={<Mail className="text-primary" />} label="Email" value={institution.contact_person_email} />
                <InfoRow icon={<Phone className="text-primary" />} label="Phone" value={institution.contact_person_mobile} />
                <InfoRow icon={<Building2 className="text-primary" />} label="Designation" value={institution.contact_person_designation} />
              </div>
            </GlassCard>
          )}
          {activeTab === 'documents' && (
            <GlassCard>
              <SectionTitle>Documents</SectionTitle>
              <div className="flex flex-col gap-4">

                {/* Prospectus */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Prospectus</div>
                  {institution.prospectus ? (
                    <div className="flex items-center gap-3 p-2 rounded bg-white/80 border border-primary/10 shadow-sm">
                      <File className="text-primary h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{institution.prospectus.name}</div>
                        <div className="text-xs text-gray-500">{institution.prospectus.mime_type} • {(institution.prospectus.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <a href={institution.prospectus.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-semibold mr-2">View</a>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-base px-2 py-1">—</div>
                  )}
                </div>
                {/* Contract Copy */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Contract Copy</div>
                  {institution.contract_copy ? (
                    <div className="flex items-center gap-3 p-2 rounded bg-white/80 border border-primary/10 shadow-sm">
                      <File className="text-primary h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{institution.contract_copy.name}</div>
                        <div className="text-xs text-gray-500">{institution.contract_copy.mime_type} • {(institution.contract_copy.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <a href={institution.contract_copy.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-semibold mr-2">View</a>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-base px-2 py-1">—</div>
                  )}
                </div>
                {/* Additional Files */}
                {institution.additional_files && institution.additional_files.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-2 font-semibold text-gray-700">Additional Files</div>
                    <ul className="space-y-2">
                      {institution.additional_files.map((file) => (
                        <li key={file.id} className="flex items-center gap-3 p-2 rounded bg-white/80 border border-primary/10 shadow-sm">
                          <File className="text-primary h-5 w-5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{file.title || file.name}</div>
                            <div className="text-xs text-gray-500">{file.mime_type} • {(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-semibold mr-2">View</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
