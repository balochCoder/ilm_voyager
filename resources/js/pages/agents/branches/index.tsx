import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusSwitch } from '@/components/ui/status-switch';
import AppLayout from '@/layouts/app-layout';
import { BranchResource, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Building2, Check } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from '@/components/stats-card';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface Props {
  branches: BranchResource;
  branchesTotal: number;
  branchesActive: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/agents/dashboard' },
  { title: 'Branches', href: '/agents/branches' },
];

export default function BranchesIndex({ branches, branchesTotal, branchesActive }: Props) {
    const {flash} = usePage<SharedData>().props;
useEffect(() => {
    if (flash?.success) {
        toast.success(flash.success);
    }
}, [flash]);

const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    router.visit(url.toString(), { preserveState: true, preserveScroll: true });
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Branches" />
      <div className="flex h-full flex-1 flex-col space-y-4 overflow-x-hidden p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Heading title="Branches" description="Manage your branches and their contacts" />
          </div>
          <Link href={route('agents:branches:create')} className="w-full sm:w-auto">
            <Button className="w-full cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <StatsCard
            icon={<Building2 className="h-4 w-4 text-blue-600" aria-label="Total branches icon" />}
            label="Total Branches"
            value={branchesTotal}
            bgColor="bg-blue-100"
            iconAriaLabel="Total branches icon"
          />
          <StatsCard
            icon={<Check className="h-4 w-4 text-green-600" aria-label="Active branches icon" />}
            label="Active"
            value={branchesActive}
            bgColor="bg-green-100"
            iconAriaLabel="Active branches icon"
          />
        </div>

        {/* Branches Grid */}
        {branches.data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.data.map((branch) => (
              <Card key={branch.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  {/* Branch Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{branch.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Added {format(new Date(branch.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <StatusSwitch
                      id={branch.id}
                      checked={branch.is_active}
                      route={route('agents:branches:toggle-status', { branch: branch.id })}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Contact Person:</span>
                      <span className="font-medium">{branch.contact_person_name || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium truncate max-w-[120px]" title={branch.contact_person_email}>
                        {branch.contact_person_email || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="font-medium">{branch.contact_person_mobile || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-end">
                      <Link href={route('agents:branches:edit', { branch: branch.id })}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {branches.data.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                <Building2 className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No branches found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first branch</p>
              <Link href={route('agents:branches:create')}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Branch
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {branches.meta && branches.meta.last_page > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  size="default"
                  onClick={() => handlePageChange(branches.meta.current_page - 1)}
                />
              </PaginationItem>
              {Array.from({ length: branches.meta.last_page }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  {typeof page === 'string' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      className="cursor-pointer"
                      size="default"
                      onClick={() => handlePageChange(page)}
                      isActive={page === branches.meta.current_page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  size="default"
                  onClick={() => handlePageChange(branches.meta.current_page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  );
}
