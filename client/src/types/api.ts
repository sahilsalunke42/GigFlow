export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}
