import { loginRequestPublicSchema } from '@dev-dashboard/shared';
import { useState } from 'react';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const isValid = loginRequestPublicSchema.safeParse({
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
