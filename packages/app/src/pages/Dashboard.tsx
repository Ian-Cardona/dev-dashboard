import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { state } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {state.authUser?.email || 'No user'}</p>
      <p>User status: {state.authUser?.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
};

export default DashboardPage;
