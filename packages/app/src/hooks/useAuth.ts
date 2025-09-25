import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined)
    throw new Error('useAuth must be used within AuthContextProvider');
  return auth;
};
