export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';

export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
];

export const LEAD_SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: 'Referral' },
];

export const ITEMS_PER_PAGE = 10;
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: ITEMS_PER_PAGE,
};
