import type { UserPublic } from '@dev-dashboard/shared';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserPublic | null;
  refreshAuth: () => void;
}
