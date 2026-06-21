// src/types/api.ts
// Shared API response types
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
