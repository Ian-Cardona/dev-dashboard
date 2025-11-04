import { fetchGithubNotifications } from '../api/integrationsApi';
import type { GithubNotificationResponse } from '@dev-dashboard/shared';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchGithubNotifications = () => {
  return useQuery<GithubNotificationResponse[]>({
    queryKey: ['github', 'notifications'],
    queryFn: fetchGithubNotifications,
  });
};

export default useQueryFetchGithubNotifications;
