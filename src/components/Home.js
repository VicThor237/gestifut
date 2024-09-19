import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useAuth } from '../services/authContext';  // Importar el contexto de autenticación
import { logoutUser } from '../services/authService';

const Home = () => {
  const { user } = useAuth();  // Obtenemos el usuario del contexto
  const navigate = useNavigate();

  // Imprimir la información completa del usuario para debug
  console.log('Información del usuario en Home:', user);

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      await logoutUser();  // Llamar la función de logout
      navigate('/login');  // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>Bienvenido a la Aplicación</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ mr: 2 }}>
          Iniciar Sesión
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>
          Registrarse
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {/* Mostrar nombre completo y email */}
        Bienvenido de nuevo, {user.firstName} {user.lastName} ({user.email})!
      </Typography>
      {/* Botones para crear equipo y asignar roles */}
      <Button variant="contained" onClick={() => navigate('/create-team')} sx={{ mr: 2 }}>
        Crear Equipo
      </Button>
      <Button variant="contained" onClick={() => navigate('/assign-roles')}>
        Asignar Roles y Equipos
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Box>
  );
};

export default Home;
