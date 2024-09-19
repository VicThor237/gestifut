import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';  // Ruta adaptada para firebase
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  CircularProgress,
} from '@mui/material';

const AdminRoleAssignment = () => {
  const [users, setUsers] = useState([]);  // Lista de usuarios
  const [teams, setTeams] = useState([]);  // Lista de equipos
  const [selectedUser, setSelectedUser] = useState('');  // Usuario seleccionado
  const [selectedRole, setSelectedRole] = useState('');  // Rol seleccionado
  const [selectedTeam, setSelectedTeam] = useState('');  // Equipo seleccionado
  const [loading, setLoading] = useState(true);

  // Obtener usuarios y equipos de Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener usuarios
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);

      // Obtener equipos
      const teamsSnapshot = await getDocs(collection(db, 'teams'));
      const teamsList = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsList);

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener usuarios y equipos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Asignar rol y equipo al usuario seleccionado
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole || !selectedTeam) {
      alert('Por favor, selecciona un usuario, un rol y un equipo.');
      return;
    }
  
    try {
      const userRef = doc(db, 'users', selectedUser);
      await updateDoc(userRef, {
        role: selectedRole,
        teamId: selectedTeam,  // Guardar el teamId en lugar del nombre
      });
  
      alert('Rol y equipo asignados correctamente.');
      setSelectedUser('');
      setSelectedRole('');
      setSelectedTeam('');
    } catch (error) {
      console.error('Error al asignar rol y equipo:', error);
    }
  };
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Asignar Rol y Equipo a Usuarios
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Usuario</InputLabel>
        <MuiSelect
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Seleccionar Usuario"
        >
            {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
                {user.firstName + ' ' + user.lastName + ' (' + user.email + ')'}  {/* Mostrar nombre completo y email */}
            </MenuItem>
            ))}
        </MuiSelect>
      </FormControl>


      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Rol</InputLabel>
        <MuiSelect
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          label="Seleccionar Rol"
        >
          <MenuItem value="admin">Administrador</MenuItem>
          <MenuItem value="op">Presidente</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
          <MenuItem value="player">Jugador</MenuItem>
        </MuiSelect>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Equipo</InputLabel>
        <MuiSelect
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            label="Seleccionar Equipo"
        >
            {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>  {/* Guardar el teamId */}
                {team.name}  {/* Mostrar el nombre del equipo */}
            </MenuItem>
            ))}
        </MuiSelect>
      </FormControl>


      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleAssignRole}
      >
        Asignar Rol y Equipo
      </Button>
    </Box>
  );
};

export default AdminRoleAssignment;
