import { registerInitEmailRequestSchema } from '@dev-dashboard/shared';
import { useState } from 'react';

export const useRegisterInitForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const schemaValid = registerInitEmailRequestSchema.safeParse({
    email,
    password,
  }).success;

  const passwordsMatch = password === confirmPassword;
  const isValid = schemaValid && passwordsMatch;

  return {
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
    resetForm,
    isValid,
    passwordsMatch,
  };
};
