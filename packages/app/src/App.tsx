import Register from './pages/auth/Register.tsx';
import { Routes, Route } from 'react-router';
import Login from './pages/auth/Login.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
