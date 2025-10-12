import RegisterForm from '../features/register/components/RegisterForm';
import RegisterInfoPanel from '../features/register/components/RegisterInfoPanel';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
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
