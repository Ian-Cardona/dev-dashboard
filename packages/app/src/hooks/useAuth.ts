import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined)
    throw new Error('useAuth must be used within AuthContextProvider');
  return auth;
};
