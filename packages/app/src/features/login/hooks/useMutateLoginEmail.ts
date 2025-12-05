import { authQueryKeys } from '../../../lib/tanstack/auth';
import { loginByEmail } from '../api/loginApi';
import type { LoginPublic, LoginRequestPublic } from '@dev-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';

export const useMutateLoginEmail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequestPublic) => loginByEmail(data),
    retry: false,
    onSuccess: (data: LoginPublic) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), data.user);

      const location = router.state.location;
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirect') || '/todos/pending';

      navigate({ to: redirectTo });
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      queryClient.setQueryData(authQueryKeys.user(), null);
    },
  });
};
