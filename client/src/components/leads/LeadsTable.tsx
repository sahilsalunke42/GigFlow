import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Lead } from '@/types';
import { Table } from '@/components/common';
import { formatDate, formatCurrency, capitalizeString } from '@/utils';

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
    },
    {
      key: 'email' as const,
      label: 'Email',
    },
    {
      key: 'company' as const,
      label: 'Company',
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (status: string) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {capitalizeString(status)}
        </span>
      ),
    },
    {
      key: 'value' as const,
      label: 'Value',
      render: (value: number) => formatCurrency(value || 0),
    },
    {
      key: 'createdAt' as const,
      label: 'Created',
      render: (date: string) => formatDate(date),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (_: string, lead: Lead) => (
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(lead)}
              className="p-1 hover:bg-blue-100 text-blue-600 rounded transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(lead)}
              className="p-1 hover:bg-yellow-100 text-yellow-600 rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(lead)}
              className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={leads} isLoading={isLoading} />;
};
