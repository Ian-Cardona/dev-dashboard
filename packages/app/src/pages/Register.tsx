import RegisterForm from '../features/register/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md rounded-lg shadow p-6">
        <h1 className="font-inter text-4xl sm:text-5xl font-bold text-center mb-6">
          Register
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
