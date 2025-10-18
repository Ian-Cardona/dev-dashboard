import LoginForm from '../features/login/components/LoginForm';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

const LoginPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const loginGithub = useMutateLoginGithub();

  useEffect(() => {
    const provider = params.get('provider');
    const id = params.get('id');
    const login = params.get('login');

    if (provider && id && login) {
      loginGithub.mutate(
        { provider, id, login },
        {
          onSuccess: () => {
            navigate('/todos', { replace: true });
          },
          onError: () => {
            navigate('/login?error=oauth_failed', { replace: true });
          },
        }
      );
    }
  }, [params, loginGithub, navigate]);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <LoginForm isOauthPending={loginGithub.isPending} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
