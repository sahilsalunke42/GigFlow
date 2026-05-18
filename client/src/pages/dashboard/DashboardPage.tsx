import React from 'react';
import { Users, TrendingUp, Target, BadgePercent } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { Loader, EmptyState, ErrorState } from '@/components/common';
import { useLeads } from '@/hooks';
import { DEFAULT_PAGINATION } from '@/utils/constants';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const DashboardPage: React.FC = () => {
  const { data: leadsData, isLoading, error } = useLeads({
    ...DEFAULT_PAGINATION,
    limit: 100,
  });
  const { data: qualifiedLeadsData } = useLeads({
    ...DEFAULT_PAGINATION,
    limit: 1,
    status: ['qualified'],
  });
  const { data: newLeadsData } = useLeads({
    ...DEFAULT_PAGINATION,
    limit: 1,
    status: ['new'],
  });

  if (error) {
    return (
      <MainLayout>
        <ErrorState
          title="Failed to load dashboard"
          description="There was an error loading your dashboard data."
          action={{
            label: 'Try Again',
            onClick: () => window.location.reload(),
          }}
        />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader fullHeight={false} />
      </MainLayout>
    );
  }

  if (!leadsData) {
    return (
      <MainLayout>
        <EmptyState title="No data available" />
      </MainLayout>
    );
  }

  const leads = leadsData.data || [];
  const totalLeads = leadsData.total || 0;
  const newLeads = newLeadsData?.total || 0;
  const qualifiedLeads = qualifiedLeadsData?.total || 0;
  const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  const stats: StatCard[] = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'New Leads',
      value: newLeads,
      icon: <Target className="w-8 h-8" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Qualified',
      value: qualifiedLeads,
      icon: <BadgePercent className="w-8 h-8" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Value',
      value: `$${(totalValue / 1000).toFixed(1)}k`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your Smart Leads Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">
            You have{' '}
            <span className="font-semibold text-gray-900">{totalLeads} total leads</span> with{' '}
            <span className="font-semibold text-gray-900">{qualifiedLeads} qualified leads</span> this
            month.
          </p>
          <p className="text-gray-600 mt-2">
            Navigate to the <span className="font-semibold">Leads</span> section to manage your
            leads.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
