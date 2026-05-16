import { useEffect, useState } from 'react';
import { PAGE_SIZE } from '@/constants';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { StatsCards } from '@/components/leads/StatsCards';
import { LeadsFilters } from '@/components/leads/LeadsFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { ConfirmDialog } from '@/components/leads/ConfirmDialog';
import { useLeadFilters } from '@/hooks/useLeadFilters';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useLeads,
  useLeadStats,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useExportLeads,
} from '@/hooks/useLeads';
import { Lead } from '@/types';
import { LeadFormData } from '@/schemas/lead.schema';

export function LeadsPage() {
  const { filters, setFilters, clearFilters } = useLeadFilters();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const urlSearch = filters.search || '';
    const nextSearch = debouncedSearch || '';
    if (urlSearch !== nextSearch) {
      setFilters({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  const queryFilters = {
    ...filters,
    search: debouncedSearch || undefined,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, refetch } = useLeads(queryFilters);
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportLeads();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSubmit = (formData: LeadFormData) => {
    if (editingLead) {
      updateMutation.mutate(
        { id: editingLead._id, data: formData },
        { onSuccess: () => { setModalOpen(false); setEditingLead(null); } }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Leads</h2>
          <p className="text-sm text-slate-500">Manage and track your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => exportMutation.mutate(queryFilters)}
            isLoading={exportMutation.isPending}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => { setEditingLead(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />

      <LeadsFilters
        filters={{ ...filters, search: debouncedSearch }}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={setFilters}
        onClear={clearFilters}
      />

      {isError ? (
        <div className="card flex flex-col items-center gap-3 text-center text-rose-600">
          <p>Failed to load leads. Please try again.</p>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <LeadsTable
            leads={data?.data ?? []}
            isLoading={isLoading}
            onEdit={(lead) => { setEditingLead(lead); setModalOpen(true); }}
            onDelete={setDeleteTarget}
            onCreate={() => { setEditingLead(null); setModalOpen(true); }}
          />
          {data?.pagination && (
            <Pagination
              pagination={data.pagination}
              onPageChange={(page) => setFilters({ page }, false)}
            />
          )}
        </>
      )}

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingLead(null); }}
        onSubmit={handleSubmit}
        lead={editingLead}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget._id, {
              onSuccess: () => setDeleteTarget(null),
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
