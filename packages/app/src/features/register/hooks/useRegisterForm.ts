import { useState } from 'react';
import { authenticationRegisterRequestSchema } from '../../../../../shared/schemas/auth.schema';

export const useRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const isValid = authenticationRegisterRequestSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  }).success;

  return {
    email,
    password,
    firstName,
    lastName,
    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    resetForm,
    isValid,
  };
};
