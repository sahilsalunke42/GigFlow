import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useLogout } from '@/hooks';
import { Button } from '@/components/common';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded transition-colors md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">Smart Leads Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="text-gray-600">Welcome,</p>
            <p className="font-semibold text-gray-900">{user?.name}</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
