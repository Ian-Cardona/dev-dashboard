import { fetchUserProfile } from '../api/userProfileApi';
import { useQuery } from '@tanstack/react-query';

export const useQueryFetchUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => fetchUserProfile(),
  });
};
