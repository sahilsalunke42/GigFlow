import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth';
import { useLogin } from '@/hooks';
import { LoginRequest } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error: loginError } = useLogin();

  const handleLogin = (data: LoginRequest) => {
    login(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Leads</h1>
            <p className="text-gray-600">Dashboard Sign In</p>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isPending}
            error={loginError ? String(loginError) : null}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
