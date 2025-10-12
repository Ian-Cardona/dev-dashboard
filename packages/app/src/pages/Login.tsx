import LoginForm from '../features/login/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
