import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters } from '@/types';
import { LeadFormData } from '@/schemas/lead.schema';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/api/client';

export const LEADS_QUERY_KEY = 'leads';
export const STATS_QUERY_KEY = 'lead-stats';

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    placeholderData: (prev) => prev,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: leadsApi.getStats,
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLead(id!),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead created successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsApi.updateLead(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [LEADS_QUERY_KEY] });
      const previous = queryClient.getQueriesData({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.setQueriesData<{ data: { _id: string }[] }>(
        { queryKey: [LEADS_QUERY_KEY] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((lead) =>
              lead._id === id ? { ...lead, ...data } : lead
            ),
          };
        }
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getErrorMessage(err));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead updated successfully');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead deleted successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useExportLeads() {
  return useMutation({
    mutationFn: (filters: LeadFilters) => leadsApi.exportLeads(filters),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.href = url;
      link.download = `leads-export-${timestamp}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
