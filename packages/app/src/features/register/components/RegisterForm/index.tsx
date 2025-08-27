import { useRegisterForm, useRegisterMutation } from '../../hooks';

const RegisterForm = () => {
  const {
    email,
    password,
    firstName,
    lastName,
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    isValid,
    resetForm,
  } = useRegisterForm();
  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      registerMutation.mutate(
        { email, password, firstName, lastName },
        {
          onSuccess: () => resetForm(),
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
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
      <button type="submit" disabled={registerMutation.isPending || !isValid}>
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
