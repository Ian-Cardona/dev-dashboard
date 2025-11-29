interface ApiErrorResponse {
  error?: string;
  message: string;
  status?: number;
}

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ApiErrorResponse).message;
  }
  return 'Something went wrong';
};

export const isUnauthorizedError = (error: unknown): boolean => {
  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorResponse;
    return apiError.status === 401 || apiError.error === 'Unauthorized';
  }
  return false;
};
