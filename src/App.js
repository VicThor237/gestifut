import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateTeam from './components/admin/CreateTeam';
import AdminRoleAssignment from './components/admin/AdminRoleAssignment';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './services/authContext';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/create-team"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-roles"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRoleAssignment />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
