import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { state } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {state?.user?.email || 'No user'}</p>
      <p>Access token: {state?.accessToken ? 'Present' : 'Missing'}</p>
    </div>
  );
};

export default Dashboard;
