export interface RepoSummary {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  htmlUrl: string;
  description?: string;
  defaultBranch: string;
  openIssuesCount: number;
  fork: boolean;
  archived: boolean;
}

export interface WorkflowRunSummary {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?:
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'timed_out'
    | 'action_required'
    | null;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  headBranch: string;
  headSha: string;
}

export interface PullRequestSummary {
  id: number;
  number: number;
  title: string;
  user: { login: string; avatarUrl?: string };
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
  state: 'open' | 'closed';
  draft: boolean;
}

export interface CommitSummary {
  sha: string;
  author: { name: string; email: string; username?: string };
  message: string;
  htmlUrl: string;
  date: string;
}

export interface NotificationSummary {
  id: string;
  reason: string;
  subject: { title: string; url: string; type: string };
  repository: { id: number; fullName: string };
  unread: boolean;
  updatedAt: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // UNIX timestamp
}

export interface IGithubIntegrationRepository {
  listUserRepos(username: string): Promise<RepoSummary[]>;
  getRepo(owner: string, repo: string): Promise<RepoSummary>;
  getLatestWorkflowRun(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<WorkflowRunSummary | null>;
  listOpenPullRequests(
    owner: string,
    repo: string
  ): Promise<PullRequestSummary[]>;
  countOpenIssues(owner: string, repo: string): Promise<number>;
  listRecentCommits(
    owner: string,
    repo: string,
    branch?: string,
    limit?: number
  ): Promise<CommitSummary[]>;
  listNotifications?(): Promise<NotificationSummary[]>;
  getRateLimit(): Promise<RateLimitInfo>;
}
