import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, User, Mail, Phone, Info, FileText, Building2, Check
} from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">{children}</h3>;
}

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

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mb-8 w-full rounded-2xl border border-primary/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

const tabs = [
  { key: 'overview', label: 'Overview', icon: <Info className="mr-1 h-4 w-4" /> },
  { key: 'contact', label: 'Contact', icon: <User className="mr-1 h-4 w-4" /> },
  { key: 'documents', label: 'Documents', icon: <FileText className="mr-1 h-4 w-4" /> },
];

export default function ShowAssociate({ associate }: { associate: any }) {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <AppLayout>
      <Head title={associate.associate_name} />
      <div className="flex h-full w-full flex-1 flex-col space-y-4 p-2 sm:space-y-6 sm:p-4 md:p-6">
        {/* Top Bar: Heading and Back Button */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <Heading title="Associate Detail" description="Details of associate" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Link href={route('agents:associates:edit', { associate: associate.id })} className="w-full md:w-auto">
              <Button variant="outline" className="w-full cursor-pointer">
                Edit
              </Button>
            </Link>
            <Link href={route('agents:associates:index')} className="w-full md:w-auto">
              <Button className="w-full cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Associates
              </Button>
            </Link>
          </div>
        </div>
        {/* Hero Section */}
        <div className="mb-8 flex w-full flex-col items-center gap-6 sm:gap-8 md:flex-row">
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl shadow-lg border border-white/40 bg-white/60">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-4xl font-bold border border-primary/20">
                {getInitials(associate.associate_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            <h2 className="mb-2 break-words whitespace-normal text-base sm:text-lg md:text-xl font-extrabold text-gray-900">{associate.associate_name}</h2>
            <div className="mb-3 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <Badge variant="secondary">{associate.category?.charAt(0).toUpperCase() + associate.category?.slice(1)}</Badge>
              {associate.country?.name && <Badge variant="outline">{associate.country.name}</Badge>}
              <Badge variant={associate.is_active ? 'default' : 'destructive'}>{associate.is_active ? 'Active' : 'Inactive'}</Badge>
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
                  <SectionTitle>Associate Details</SectionTitle>
                  <InfoRow icon={<Building2 className="text-primary" />} label="Branch" value={associate.branch?.name} />
                  <InfoRow icon={<Info className="text-primary" />} label="Address" value={associate.address} />
                  <InfoRow icon={<Info className="text-primary" />} label="City" value={associate.city} />
                  <InfoRow icon={<Info className="text-primary" />} label="State" value={associate.state} />
                  <InfoRow icon={<Info className="text-primary" />} label="Country" value={associate.country?.name} />
                  <InfoRow icon={<Info className="text-primary" />} label="Website" value={associate.website} />
                  <InfoRow icon={<Info className="text-primary" />} label="Term of Association" value={associate.term_of_association} />
                  <InfoRow icon={<FileText className="text-primary" />} label="Contract File" value={associate.contract_term_file ? (<a href={associate.contract_term_file} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download</a>) : null} />
                </div>
                <div>
                  <SectionTitle>Meta</SectionTitle>
                  <InfoRow icon={<Check className="text-primary" />} label="Active" value={associate.is_active ? 'Yes' : 'No'} />
                  <InfoRow icon={<Info className="text-primary" />} label="Created" value={format(new Date(associate.created_at), 'MMM dd, yyyy')} />
                  <InfoRow icon={<Info className="text-primary" />} label="Updated" value={format(new Date(associate.updated_at), 'MMM dd, yyyy')} />
                </div>
              </div>
            </GlassCard>
          )}
          {activeTab === 'contact' && (
            <GlassCard>
              <SectionTitle>Contact Details</SectionTitle>
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                <InfoRow icon={<User className="text-primary" />} label="Contact Person" value={associate.contact_person} />
                <InfoRow icon={<Mail className="text-primary" />} label="Email" value={associate.contact_email} />
                <InfoRow icon={<Phone className="text-primary" />} label="Mobile" value={associate.contact_mobile} />
                <InfoRow icon={<Building2 className="text-primary" />} label="Designation" value={associate.designation} />
                <InfoRow icon={<Phone className="text-primary" />} label="Phone" value={associate.contact_phone} />
                <InfoRow icon={<Info className="text-primary" />} label="Skype" value={associate.contact_skype} />
              </div>
            </GlassCard>
          )}
          {activeTab === 'documents' && (
            <GlassCard>
              <SectionTitle>Documents</SectionTitle>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Contract File</div>
                  {associate.contract_file_url ? (
                    <a href={associate.contract_file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download Contract</a>
                  ) : (
                    <span className="text-gray-400">No contract file uploaded.</span>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
