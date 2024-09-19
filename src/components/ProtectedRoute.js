import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Mientras cargamos el estado de autenticación, no hacemos nada
  if (loading) {
    return <div>Cargando...</div>;  // Muestra un loading mientras carga el estado de autenticación
  }

  // Si no hay usuario, redirigimos al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el usuario no tiene el rol adecuado, redirigimos al home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // Si el usuario tiene permiso, renderizamos el componente protegido
  return children;
};

export default ProtectedRoute;
