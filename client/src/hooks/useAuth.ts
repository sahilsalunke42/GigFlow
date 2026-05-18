import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import { LoginRequest, RegisterRequest } from '@/types';

export const useLogin = () => {
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      setError(null);
      const response = await authApi.login(data);
      login(response.user, response.token);
      return response;
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
    },
  });

  return { ...mutation, error };
};

export const useRegister = () => {
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      setError(null);
      const response = await authApi.register(data);
      login(response.user, response.token);
      return response;
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
    },
  });

  return { ...mutation, error };
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      logout();
    },
  });

  return mutation;
};

export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      setError(null);
      const response = await authApi.getCurrentUser();
      useAuthStore.setState({ user: response.user });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return { user, isAuthenticated, error, loading, refetch };
};
