import { Routes, Route } from 'react-router';
import { PublicRoute, ProtectedRoute } from './components/Routes';
import { LoginPage, DashboardPage, RegisterPage } from './pages';

function App() {
  return (
    <Routes>
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
