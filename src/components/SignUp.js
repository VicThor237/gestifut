import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import 'react-phone-input-2/lib/style.css';  // Importar los estilos de react-phone-input-2
import PhoneInput from 'react-phone-input-2';
import { registerUser } from '../services/authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');  // Campo para el nombre
  const [lastName, setLastName] = useState('');    // Campo para los apellidos
  const [phone, setPhone] = useState('');          // Campo para el teléfono
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Llamamos a la función de registro con los nuevos campos
      await registerUser(email, password, firstName, lastName, phone);
      console.log('Usuario registrado con éxito');
    } catch (error) {
      setError('Error al registrar el usuario: ' + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Registro</Typography>
      <form onSubmit={handleSignUp}>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <TextField
          label="Apellidos"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <PhoneInput
          country={'us'}
          value={phone}
          onChange={setPhone}
          inputStyle={{ width: '100%', marginTop: '16px' }}
          required
        />
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Registrarse
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </form>
    </Box>
  );
};

export default SignUp;
