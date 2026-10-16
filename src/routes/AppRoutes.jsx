import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/app/Home';
import Stats from '../pages/app/Stats';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/statistika" element={<Stats />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
