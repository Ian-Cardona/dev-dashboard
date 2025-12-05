import { authQueryKeys } from '../../../lib/tanstack/auth';
import { loginByOAuth } from '../api/loginApi';
import type { LoginPublic, OAuthRequest } from '@dev-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';

export const useMutateLoginOAuth = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OAuthRequest) => loginByOAuth(data),
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
