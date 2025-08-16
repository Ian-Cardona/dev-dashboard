import { useState } from 'react';
import { authAPI } from '../../lib/auth';
import { devApi } from '../../lib/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(email, password);
      console.log('User registered successfully', response);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleConnectionTest = () => {
    devApi.get('/health').then(() => {
      console.log('API connection test successful');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Register</h1>
      <button onClick={handleConnectionTest}>Check API connection</button>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
