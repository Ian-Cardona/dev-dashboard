import AppLayout from './components/layout/AppLayout';
import { PublicRoute, ProtectedRoute } from './components/routes/Routes';
import CustomToast from './components/ui/CustomToast';
import { LoginPage, TodosPage, RegisterPage, SettingsPage } from './pages';
import { Routes, Route, Navigate } from 'react-router';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/todos" replace />} />
            <Route path="todos">
              <Route index element={<Navigate to="/todos/pending" replace />} />
              <Route path="pending" element={<TodosPage />} />
              <Route path="history" element={<TodosPage />} />
              <Route path="analytics" element={<TodosPage />} />
            </Route>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CustomToast />
    </>
  );
}

export default App;
