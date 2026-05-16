import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useLead, useDeleteLead } from '@/hooks/useLeads';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { STATUS_COLORS } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/leads/ConfirmDialog';
import { LeadFormModal } from '@/components/leads/LeadFormModal';
import { useUpdateLead } from '@/hooks/useLeads';
import { LeadFormData } from '@/schemas/lead.schema';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError } = useLead(id);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === UserRole.ADMIN;
  const deleteMutation = useDeleteLead();
  const updateMutation = useUpdateLead();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="card text-center">
        <p className="text-rose-600">Lead not found</p>
        <Link to="/leads" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to leads
        </Link>
      </div>
    );
  }

  const handleUpdate = (data: LeadFormData) => {
    updateMutation.mutate(
      { id: lead._id, data },
      { onSuccess: () => setShowEdit(false) }
    );
  };

  return (
    <div className="space-y-6">
      <Link
        to="/leads"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{lead.name}</h2>
            <p className="mt-1 text-slate-500">{lead.email}</p>
            <div className="mt-3 flex gap-2">
              <Badge className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
              <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {lead.source}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowEdit(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            {isAdmin && (
              <Button variant="danger" onClick={() => setShowDelete(true)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">Created</dt>
            <dd className="mt-1 text-sm">{new Date(lead.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">Last updated</dt>
            <dd className="mt-1 text-sm">{new Date(lead.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      <LeadFormModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleUpdate}
        lead={lead}
        isLoading={updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"?`}
        onConfirm={() =>
          deleteMutation.mutate(lead._id, {
            onSuccess: () => navigate('/leads'),
          })
        }
        onCancel={() => setShowDelete(false)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
