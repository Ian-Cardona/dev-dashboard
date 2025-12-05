import { fetchUserProfile } from '../api/accountApi';
import { useQuery } from '@tanstack/react-query';

export const useQueryFetchUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => fetchUserProfile(),
  });
};
