import { Routes, Route } from 'react-router';
import { PublicRoute, ProtectedRoute } from './components/routes/Routes';
import { LoginPage, DashboardPage, RegisterPage } from './pages';
import { Navigate } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
