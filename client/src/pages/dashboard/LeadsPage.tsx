import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Loader, EmptyState, ErrorState, Modal, Button } from '@/components/common';
import { LeadsTable, LeadForm, LeadFilters } from '@/components/leads';
import { Pagination } from '@/components/common';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useAssignableUsers } from '@/hooks';
import { useAuthStore, useLeadsStore } from '@/store';
import { Lead, CreateLeadRequest, UpdateLeadRequest } from '@/types';
import { exportLeadsToCSV } from '@/utils';
import { Plus } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const filters = useLeadsStore((state) => state.filters);
  const setPage = useLeadsStore((state) => state.setPage);
  const setSearch = useLeadsStore((state) => state.setSearch);
  const setStatus = useLeadsStore((state) => state.setStatus);
  const setSource = useLeadsStore((state) => state.setSource);

  const { data: leadsData, isLoading, error } = useLeads(filters);
  const { data: assignableUsers = [] } = useAssignableUsers();
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: updateLead, isPending: isUpdating } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateLead = (data: CreateLeadRequest) => {
    createLead(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleUpdateLead = (data: CreateLeadRequest) => {
    if (!editingLead) return;
    updateLead(
      { id: editingLead.id, data: data as UpdateLeadRequest },
      {
        onSuccess: () => {
          setEditingLead(null);
        },
      }
    );
  };

  const handleDeleteLead = (id: string) => {
    deleteLead(id, {
      onSuccess: () => {
        setDeleteConfirmId(null);
      },
    });
  };

  const handleExport = () => {
    if (leadsData?.data) {
      exportLeadsToCSV(leadsData.data, 'leads.csv');
    }
  };

  if (error) {
    return (
      <MainLayout>
        <ErrorState
          title="Failed to load leads"
          description="There was an error loading your leads."
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload(),
          }}
        />
      </MainLayout>
    );
  }

  const leads = leadsData?.data || [];
  const totalPages = leadsData?.pages || 1;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">
              Manage your leads and track their progress
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </Button>
        </div>

        <LeadFilters
          onSearch={setSearch}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          onExport={handleExport}
        />

        {isLoading ? (
          <Loader fullHeight={false} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Create your first lead or adjust your filters"
            action={{
              label: 'Create Lead',
              onClick: () => setIsCreateModalOpen(true),
            }}
          />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <LeadsTable
                leads={leads}
                isLoading={isLoading}
                onEdit={setEditingLead}
                onDelete={(lead) => setDeleteConfirmId(lead.id)}
              />
            </div>

            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Lead"
        size="md"
      >
        <LeadForm
          onSubmit={handleCreateLead}
          isLoading={isCreating}
          isAdmin={isAdmin}
          assignableUsers={assignableUsers}
        />
      </Modal>

      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editingLead && (
          <LeadForm
            onSubmit={handleUpdateLead}
            initialData={editingLead}
            isLoading={isUpdating}
            isAdmin={isAdmin}
            assignableUsers={assignableUsers}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={() => deleteConfirmId && handleDeleteLead(deleteConfirmId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
