import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute, PublicRoute } from './components/routes/Routes';
import CustomToast from './components/ui/CustomToast';
import { LoginPage, RegisterPage, SettingsPage, TodosPage } from './pages';
import IntegrationsPage from './pages/Integrations';
import OnboardingPage from './pages/Onboarding';
import { Navigate, Route, Routes } from 'react-router';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register">
            <Route index element={<RegisterPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
          </Route>
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

            <Route path="integrations">
              <Route
                index
                element={<Navigate to="/integrations/github" replace />}
              />
              <Route path="github" element={<IntegrationsPage />} />
            </Route>

            <Route path="settings">
              <Route
                index
                element={<Navigate to="/settings/account" replace />}
              />
              <Route path="account" element={<SettingsPage />} />
              <Route path="api-keys" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CustomToast />
    </>
  );
}

export default App;
