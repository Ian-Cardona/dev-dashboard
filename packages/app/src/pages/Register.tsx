import RegisterForm from '../features/register/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg p-6 shadow">
        <h1 className="font-inter mb-6 text-center text-4xl font-bold sm:text-5xl">
          Register
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
