import { useLoginForm, useLoginMutation } from '../../hooks';

const LoginForm = () => {
  const { email, password, setEmail, setPassword, isValid, resetForm } =
    useLoginForm();
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => resetForm(),
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loginMutation.isPending || !isValid}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
