import { Routes, Route } from 'react-router';
import { PublicRoute, ProtectedRoute } from './components/Routes';
import { LoginPage, DashboardPage, RegisterPage } from './pages';
import { Navigate } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
