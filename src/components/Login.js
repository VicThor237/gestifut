import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  // Importar el hook de navegación
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Estado de carga
  const navigate = useNavigate();  // Crear una instancia de navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Iniciar el estado de carga
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Inicio de sesión exitoso:', userCredential.user);
      setError('');
      navigate('/');  // Redirigir al Home después del inicio de sesión
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      console.error('Error al iniciar sesión:', error);
    } finally {
      setLoading(false);  // Detener el estado de carga
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <Box sx={{ mt: 3, position: 'relative' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}  // Desactivar el botón mientras carga
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
              </Button>
            </Box>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            ¿No tienes cuenta? <Button onClick={() => navigate('/register')}>Regístrate</Button>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
