import { Routes, Route } from 'react-router';
import * as pages from './pages';
import { ProtectedRoute, PublicRoute } from './components/Routes';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <pages.Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <pages.Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <pages.Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
