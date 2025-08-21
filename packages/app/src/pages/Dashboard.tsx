import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { state } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {state.authenticatedUser?.user.email || 'No user'}</p>
      <p>
        Access token:{' '}
        {state.authenticatedUser?.accessToken ? 'Present' : 'Missing'}
      </p>
    </div>
  );
};

export default DashboardPage;
