import { useToast } from '../../../hooks/useToast';
import { createResolutions } from '../api/todosApi';
import type { CreateResolution, TodoResolution } from '@dev-dashboard/shared';
import { useMutation } from '@tanstack/react-query';

interface UseMutateResolveTodosOptions {
  onSuccess?: (data: TodoResolution[], variables: CreateResolution[]) => void;
  onError?: (error: Error, variables: CreateResolution[]) => void;
}

const useMutateResolveTodos = (options: UseMutateResolveTodosOptions = {}) => {
  const { showSuccess, showError } = useToast();

  return useMutation<TodoResolution[], Error, CreateResolution[]>({
    mutationFn: data => {
      if (data.length === 0) {
        throw new Error('No resolutions selected');
      }
      return createResolutions(data);
    },

    onSuccess: (data, variables) => {
      const count = variables.length;
      showSuccess(
        `Successfully resolved ${count} todo${count !== 1 ? 's' : ''}`
      );
      options.onSuccess?.(data, variables);
    },

    onError: (error, variables) => {
      console.error('Failed to submit resolutions:', error);

      const errorMessage = error.message.includes('No resolutions selected')
        ? 'Please select at least one resolution to submit'
        : 'Failed to submit resolutions. Please try again.';

      showError(errorMessage);
      options.onError?.(error, variables);
    },
  });
};

export default useMutateResolveTodos;
