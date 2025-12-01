import { getUserProfile } from './getUserProfile';
import type { UserPublic } from '@dev-dashboard/shared';
import { isAxiosError } from 'axios';

export const getUserFromSession = async (): Promise<UserPublic | null> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return null;
  }

  try {
    const user = await getUserProfile();
    return user;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        console.log('Token invalid or expired, clearing');
        localStorage.removeItem('accessToken');
      }
    } else {
      console.error('Error fetching user session:', error);
    }
    return null;
  }
};
