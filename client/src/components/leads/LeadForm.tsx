import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AssignableUser, CreateLeadRequest, Lead } from '@/types';
import { Button, Input, Select } from '@/components/common';
import { LEAD_SOURCE_OPTIONS } from '@/utils/constants';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  source: z.enum(['website', 'instagram', 'referral']),
  notes: z.string().optional(),
  value: z.coerce.number().min(0, 'Value must be 0 or greater').optional(),
  assignedTo: z.string().optional(),
});

interface LeadFormProps {
  onSubmit: (data: CreateLeadRequest) => void;
  initialData?: Lead;
  isLoading?: boolean;
  error?: string | null;
  isAdmin?: boolean;
  assignableUsers?: AssignableUser[];
}

export const LeadForm: React.FC<LeadFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  error,
  isAdmin = false,
  assignableUsers = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadRequest>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'website',
      notes: '',
      value: 0,
      assignedTo: '',
    },
  });

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...assignableUsers.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label="Company"
          type="text"
          placeholder="Acme Inc"
          {...register('company')}
          error={errors.company?.message}
        />

        <Select
          label="Source"
          options={LEAD_SOURCE_OPTIONS}
          {...register('source')}
          error={errors.source?.message}
        />

        <Input
          label="Lead Value"
          type="number"
          placeholder="0"
          {...register('value')}
          error={errors.value?.message}
        />

        {isAdmin && (
          <Select
            label="Assign To"
            options={assigneeOptions}
            {...register('assignedTo')}
            helperText="Assign this lead to a sales user"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          placeholder="Additional notes about the lead..."
          {...register('notes')}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none h-24"
        />
      </div>

      <Button type="submit" variant="primary" size="md" fullWidth isLoading={isLoading}>
        {initialData ? 'Update Lead' : 'Create Lead'}
      </Button>
    </form>
  );
};
