import { Routes, Route } from 'react-router';
import * as pages from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<pages.Login />} />
      <Route path="/register" element={<pages.Register />} />
      <Route path="/dashboard" element={<pages.Dashboard />} />
    </Routes>
  );
}

export default App;
