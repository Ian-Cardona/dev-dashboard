import RegisterForm from '../features/register/components/RegisterForm';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-16">
      <div className="w-full max-w-md">
        <header className="mb-8 flex items-center justify-center gap-2">
          <UserPlusIcon className="h-6 w-6" />
          <h1 className="text-3xl font-semibold">Sign up to Dev Dashboard</h1>
        </header>
        <section className="relative flex flex-col rounded-2xl border bg-[var(--color-surface)] p-10">
          <RegisterForm />
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
