import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Input, Button } from '@/components/common';
import { LeadStatus, LeadSource } from '@/types';
import { LEAD_SOURCE_OPTIONS, LEAD_STATUS_OPTIONS } from '@/utils/constants';
import { useDebounce } from '@/hooks';

interface LeadFiltersProps {
  onSearch: (search: string) => void;
  onStatusChange: (status: LeadStatus[]) => void;
  onSourceChange: (source: LeadSource[]) => void;
  onExport?: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  onSearch,
  onStatusChange,
  onSourceChange,
  onExport,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus[]>([]);
  const [selectedSource, setSelectedSource] = useState<LeadSource[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleStatusToggle = (status: LeadStatus) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [...selectedStatus, status];
    setSelectedStatus(newStatus);
    onStatusChange(newStatus);
  };

  const handleSourceToggle = (source: LeadSource) => {
    const newSource = selectedSource.includes(source)
      ? selectedSource.filter((s) => s !== source)
      : [...selectedSource, source];
    setSelectedSource(newSource);
    onSourceChange(newSource);
  };

  const hasActiveFilters = selectedStatus.length > 0 || selectedSource.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'border-blue-500 text-blue-600'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{selectedStatus.length + selectedSource.length}</span>}
          </button>

          {onExport && (
            <Button variant="secondary" size="md" onClick={onExport}>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusToggle(status.value as LeadStatus)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedStatus.includes(status.value as LeadStatus)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Source</h3>
            <div className="flex flex-wrap gap-2">
              {LEAD_SOURCE_OPTIONS.map((source) => (
                <button
                  key={source.value}
                  onClick={() => handleSourceToggle(source.value as LeadSource)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    selectedSource.includes(source.value as LeadSource)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {source.label}
                </button>
              ))}
            </div>
          </div>

          {(hasActiveFilters) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStatus([]);
                setSelectedSource([]);
                onStatusChange([]);
                onSourceChange([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
