import RegisterForm from '../features/register/components/register/RegisterForm';
import RegisterInfoPanel from '../features/register/components/register/RegisterInfoPanel';
import { useMutateRegisterInitGithub } from '../features/register/hooks/useMutateRegisterInitGithub';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

const RegisterPage = () => {
  const [params] = useSearchParams();
  const provider = params.get('provider');
  const id = params.get('id');
  const login = params.get('login');

  const mutation = useMutateRegisterInitGithub();

  useEffect(() => {
    if (provider && id && login && !mutation.isPending) {
      mutation.mutate({
        provider: provider as 'github',
        id,
        login,
      });
    }
  }, [provider, id, login]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="hidden flex-1 p-8 lg:flex">
        <RegisterInfoPanel />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
