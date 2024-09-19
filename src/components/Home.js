import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Grid, Paper } from '@mui/material';
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
        <Typography variant="h4" gutterBottom>
          Bienvenido a la Aplicación
        </Typography>
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, maxWidth: 900 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
          ¡Bienvenido a GestiFut, {user.firstName} {user.lastName}!
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Mostrar solo para administradores */}
          {user.role === 'admin' && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" fullWidth onClick={() => navigate('/create-team')} sx={{ py: 2 }}>
                  Crear Equipo
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" fullWidth onClick={() => navigate('/assign-roles')} sx={{ py: 2 }}>
                  Asignar Roles y Equipos
                </Button>
              </Grid>
            </>
          )}

          {/* Mostrar solo para administradores y presidentes */}
          {['admin', 'op'].includes(user.role) && (
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="contained" fullWidth onClick={() => navigate('/add-player')} sx={{ py: 2 }}>
                Añadir Jugador
              </Button>
            </Grid>
          )}

          {/* Botón para cerrar sesión (visible para todos los usuarios) */}
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleLogout} sx={{ py: 2 }}>
              Cerrar Sesión
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            ¡Gestiona tus equipos y jugadores de manera eficiente con GestiFut!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
