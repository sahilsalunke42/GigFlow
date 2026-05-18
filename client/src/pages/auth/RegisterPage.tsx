import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '@/components/auth';
import { useRegister } from '@/hooks';
import { RegisterRequest } from '@/types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending, error: registerError } = useRegister();

  const handleRegister = (data: RegisterRequest) => {
    register(data, {
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
            <p className="text-gray-600">Create an Account</p>
          </div>

          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isPending}
            error={registerError ? String(registerError) : null}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
