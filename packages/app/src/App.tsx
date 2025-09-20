import { Routes, Route, Navigate } from 'react-router';
import { PublicRoute, ProtectedRoute } from './components/routes/Routes';
import { LoginPage, TodosPage, RegisterPage, SettingsPage } from './pages';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/todos" replace />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
