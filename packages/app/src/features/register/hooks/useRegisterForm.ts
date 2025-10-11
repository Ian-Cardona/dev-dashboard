import { registerInitEmailRegisterRequestSchema } from '@dev-dashboard/shared';
import { useState } from 'react';

export const useRegisterInitForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const isValid = registerInitEmailRegisterRequestSchema.safeParse({
    email,
    password,
  }).success;

  return {
    email,
    password,
    setEmail,
    setPassword,
    resetForm,
    isValid,
  };
};
