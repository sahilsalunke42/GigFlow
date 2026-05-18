export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'email' | 'referral' | 'social' | 'event' | 'other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  source: LeadSource;
  notes: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string | null;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  notes?: string;
  value?: number;
  assignedTo?: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  status?: LeadStatus;
}

export interface LeadFilter {
  status?: LeadStatus[];
  source?: LeadSource[];
  search?: string;
  // 'latest' | 'oldest' maps to server `sort` query param
  sort?: 'latest' | 'oldest';
  sortBy?: 'created' | 'updated' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeadsResponse extends PaginatedResponse<Lead> {}
