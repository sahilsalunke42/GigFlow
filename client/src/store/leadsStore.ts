import { create } from 'zustand';
import { LeadStatus, LeadSource, LeadFilter } from '@/types';
import { DEFAULT_PAGINATION } from '@/utils/constants';

interface LeadsStore {
  filters: LeadFilter;
  setFilters: (filters: Partial<LeadFilter>) => void;
  resetFilters: () => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setStatus: (status: LeadStatus[]) => void;
  setSource: (source: LeadSource[]) => void;
  setSortBy: (sortBy: 'created' | 'updated' | 'name') => void;
  setSort: (sort?: 'latest' | 'oldest') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
}

const defaultFilters: LeadFilter = {
  ...DEFAULT_PAGINATION,
  search: '',
  status: [],
  source: [],
  sortBy: 'created',
  sortOrder: 'desc',
};

export const useLeadsStore = create<LeadsStore>((set) => ({
  filters: defaultFilters,

  setFilters: (filters: Partial<LeadFilter>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  setSearch: (search: string) => {
    set((state) => ({
      filters: {
        ...state.filters,
        search,
        page: 1,
      },
    }));
  },

  setPage: (page: number) => {
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    }));
  },

  setStatus: (status: LeadStatus[]) => {
    set((state) => ({
      filters: {
        ...state.filters,
        status,
        page: 1,
      },
    }));
  },

  setSource: (source: LeadSource[]) => {
    set((state) => ({
      filters: {
        ...state.filters,
        source,
        page: 1,
      },
    }));
  },

  setSortBy: (sortBy: 'created' | 'updated' | 'name') => {
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
      },
    }));
  },

  setSort: (sort?: 'latest' | 'oldest') => {
    set((state) => ({
      filters: {
        ...state.filters,
        sort,
        page: 1,
      },
    }));
  },

  setSortOrder: (sortOrder: 'asc' | 'desc') => {
    set((state) => ({
      filters: {
        ...state.filters,
        sortOrder,
      },
    }));
  },
}));
