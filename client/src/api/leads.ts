import { apiClient } from './client';
import {
  Lead,
  LeadsResponse,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadFilter,
  AssignableUsersResponse,
} from '@/types';

interface LeadsServerResponse {
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const leadsApi = {
  getLeads: async (filters: LeadFilter): Promise<LeadsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.search) params.append('search', filters.search);
    if (filters.status?.length) {
      filters.status.forEach((status) => params.append('status', status));
    }
    if (filters.source?.length) {
      filters.source.forEach((source) => params.append('source', source));
    }
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await apiClient.get<LeadsServerResponse>('/leads', { params });
    return {
      data: response.data.data,
      total: response.data.pagination.total,
      page: response.data.pagination.page,
      limit: response.data.pagination.limit,
      pages: response.data.pagination.pages,
    };
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await apiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: CreateLeadRequest): Promise<Lead> => {
    const response = await apiClient.post<Lead>('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: UpdateLeadRequest): Promise<Lead> => {
    const response = await apiClient.put<Lead>(`/leads/${id}`, data);
    return response.data;
  },

  getAssignableUsers: async () => {
    const response = await apiClient.get<AssignableUsersResponse>('/auth/assignable-users');
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  bulkDeleteLeads: async (ids: string[]): Promise<void> => {
    await apiClient.post('/leads/bulk-delete', { ids });
  },

  exportLeads: async (filters: LeadFilter): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filters.status?.length) {
      filters.status.forEach((status) => params.append('status', status));
    }
    if (filters.source?.length) {
      filters.source.forEach((source) => params.append('source', source));
    }
    if (filters.search) params.append('search', filters.search);

    const response = await apiClient.get('/leads/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
