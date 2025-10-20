import RegisterForm from '../features/register/components/register/RegisterForm';
import RegisterInfoPanel from '../features/register/components/register/RegisterInfoPanel';
import { useMutateRegisterInitGithub } from '../features/register/hooks/useMutateRegisterInitGithub';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useToast } from '../hooks/useToast';

const RegisterPage = () => {
  const [params] = useSearchParams();
  const provider = params.get('provider');
  const id = params.get('id');
  const login = params.get('login');
  const error = params.get('error');

  const mutation = useMutateRegisterInitGithub();
  const hasTriggered = useRef(false);
  const toast = useToast();

  const isOAuthCallback = !!(provider && id && login);

  useEffect(() => {
    if (!isOAuthCallback || hasTriggered.current) return;

    mutation.mutate({
      provider: provider as 'github',
      id,
      login,
    });
    hasTriggered.current = true;
  }, []);

  useEffect(() => {
    if (error) {
      toast.showError("OAuth registration failed");
    }
  }, [error]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="hidden flex-1 p-8 lg:flex">
        <RegisterInfoPanel />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <RegisterForm isRegisterPending={mutation.isPending} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
