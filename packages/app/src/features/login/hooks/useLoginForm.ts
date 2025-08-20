import { useState } from 'react';
import { authenticationLoginRequestSchema } from '../../../../../shared/schemas/auth.schema';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const isValid = authenticationLoginRequestSchema.safeParse({
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
