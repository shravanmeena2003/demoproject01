import { apiClient } from './client';
import { ApiResponse, Lead, LeadFilters, LeadStats, PaginationMeta } from '@/types';
import { LeadFormData } from '@/schemas/lead.schema';

export const leadsApi = {
  getLeads: async (
    filters: LeadFilters
  ): Promise<{ data: Lead[]; pagination: PaginationMeta }> => {
    const res = await apiClient.get<ApiResponse<Lead[]>>('/leads', { params: filters });
    return { data: res.data.data, pagination: res.data.pagination! };
  },

  getLead: async (id: string): Promise<Lead> => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data;
  },

  createLead: async (data: LeadFormData): Promise<Lead> => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    const res = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const res = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data.data;
  },

  exportLeads: async (filters: LeadFilters): Promise<Blob> => {
    const res = await apiClient.get('/leads/export', {
      params: filters,
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
