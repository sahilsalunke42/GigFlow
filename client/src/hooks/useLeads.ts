import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api';
import { LeadFilter, CreateLeadRequest, UpdateLeadRequest } from '@/types';

const LEADS_QUERY_KEY = 'leads';
const LEAD_DETAIL_KEY = 'lead-detail';

export const useLeads = (filters: LeadFilter) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLead = (id: string | undefined) => {
  return useQuery({
    queryKey: [LEAD_DETAIL_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('Lead ID is required');
      return leadsApi.getLeadById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadRequest) => leadsApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadRequest }) =>
      leadsApi.updateLead(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_DETAIL_KEY, id] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};

export const useBulkDeleteLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => leadsApi.bulkDeleteLeads(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
  });
};

export const useExportLeads = () => {
  return useMutation({
    mutationFn: (filters: LeadFilter) => leadsApi.exportLeads(filters),
  });
};

export const useAssignableUsers = () => {
  return useQuery({
    queryKey: ['assignable-users'],
    queryFn: () => leadsApi.getAssignableUsers(),
    staleTime: 1000 * 60 * 5,
  });
};
