import LoginForm from '../features/login/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
