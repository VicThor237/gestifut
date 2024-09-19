import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Incluí `updateDoc`
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AddPlayer = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [discipline, setDiscipline] = useState(''); 
  const [playerName, setPlayerName] = useState('');
  const [playerSurname, setPlayerSurname] = useState('');
  const [playerNickname, setPlayerNickname] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [countries, setCountries] = useState([]);
  const [playerNumber, setPlayerNumber] = useState('');
  const [position, setPosition] = useState('');
  const [lateralidad, setLateralidad] = useState('');
  const [positionsList, setPositionsList] = useState([]);
  const [lateralidadOptions, setLateralidadOptions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Guardar índice de edición
  const [editingPlayerId, setEditingPlayerId] = useState(null); // Guardar ID del jugador editado

  // Obtener equipos
  const fetchTeams = async () => {
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    const teamsList = teamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeams(teamsList);
  };

  useEffect(() => {
    if (user.role === 'admin') {
      fetchTeams();
    }
  }, [user]);

  // Manejar la selección de equipo
  const handleTeamSelection = async (teamId) => {
    setSelectedTeam(teamId);
    const selectedTeamObj = teams.find((team) => team.id === teamId);
    setDiscipline(selectedTeamObj?.discipline || '');

    setPlayerName('');
    setPlayerSurname('');
    setPlayerNickname('');
    setBirthDate(new Date());
    setPlayerNumber('');
    setPosition('');
    setLateralidad('');
    setEditingIndex(null);
    setEditingPlayerId(null);

    // Recuperar jugadores
    const q = query(collection(db, 'players'), where('teamId', '==', teamId));
    const playersSnapshot = await getDocs(q);
    const playersList = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPlayers(playersList);
  };

  // Obtener lista de países desde una API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryList = response.data.map(country => ({
          name: country.translations.spa.common,
          flag: country.flags.svg,
          code: country.cca2
        }));
        setCountries(countryList);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };
    fetchCountries();
  }, []);

  // Actualizar las posiciones según la disciplina
  useEffect(() => {
    if (discipline) {
      switch (discipline.toLowerCase()) {
        case 'fútbol 11':
          setPositionsList(['Portero', 'Defensa Central', 'Lateral', 'Centrocampista', 'Extremo', 'Delantero']);
          break;
        case 'fútbol 7':
          setPositionsList(['Portero', 'Defensa', 'Centrocampista', 'Delantero']);
          break;
        case 'fútbol sala':
          setPositionsList(['Portero', 'Cierre', 'Ala', 'Pívot']);
          break;
        default:
          setPositionsList([]);
      }
    }
  }, [discipline]);

  // Actualizar lateralidad según posición
  useEffect(() => {
    if (position === 'Lateral' || position === 'Extremo') {
      setLateralidadOptions(['Izquierdo', 'Derecho']);
    } else if (position === 'Centrocampista') {
      setLateralidadOptions(['Defensivo', 'Ofensivo', 'Pivote']);
    } else {
      setLateralidadOptions([]);
    }
  }, [position]);

  // Añadir o actualizar jugador
  // Añadir o actualizar jugador
const handleAddOrUpdatePlayer = async () => {
  const playerData = {
    name: playerName,
    surname: playerSurname,
    nickname: playerNickname,
    birthDate: birthDate.toISOString(), // Guardar como string ISO
    age: age,
    nationality: nationality,
    number: playerNumber,
    position: position,
    lateralidad: lateralidad,
    teamId: user.role === 'admin' ? selectedTeam : user.teamId,
  };

  try {
    if (editingPlayerId) {
      // Actualizar jugador existente
      const playerDocRef = doc(db, 'players', editingPlayerId);
      await updateDoc(playerDocRef, playerData); // Actualizar el jugador
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === editingIndex ? { id: editingPlayerId, ...playerData } : player
        )
      );
      alert('Jugador actualizado correctamente');
    } else {
      // Añadir nuevo jugador
      const newPlayerRef = await addDoc(collection(db, 'players'), playerData);
      setPlayers([...players, { id: newPlayerRef.id, ...playerData }]); // Añadir a la lista local
      alert('Jugador añadido correctamente');
    }

    // Resetear el formulario después de añadir o actualizar
    setPlayerName('');
    setPlayerSurname('');
    setPlayerNickname('');
    setBirthDate(new Date());
    setPlayerNumber('');
    setPosition('');
    setLateralidad('');
    setEditingIndex(null);
    setEditingPlayerId(null); // Limpiar ID de jugador en edición
  } catch (error) {
    console.error('Error al añadir/actualizar jugador: ', error);
  }
};


  // Editar jugador
  const handleEditPlayer = (index) => {
    const playerToEdit = players[index];
    setPlayerName(playerToEdit.name);
    setPlayerSurname(playerToEdit.surname);
    setPlayerNickname(playerToEdit.nickname || '');
    setBirthDate(new Date(playerToEdit.birthDate));
    setPlayerNumber(playerToEdit.number);
    setPosition(playerToEdit.position);
    setLateralidad(playerToEdit.lateralidad);
    setNationality(playerToEdit.nationality);
    setEditingIndex(index);
    setEditingPlayerId(playerToEdit.id); // Guardar ID del jugador en edición
  };

  // Eliminar jugador
  const handleDeletePlayer = async (index) => {
    const playerToDelete = players[index];
    try {
      await deleteDoc(doc(db, 'players', playerToDelete.id));
      const updatedPlayers = players.filter((_, i) => i !== index);
      setPlayers(updatedPlayers);
      alert('Jugador eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar jugador: ', error);
    }
  };

  // Calcular la edad según la fecha de nacimiento
  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let ageCalc = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        ageCalc--;
      }
      setAge(ageCalc);
    }
  }, [birthDate]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Box sx={{ width: '60%' }}>
        <Typography variant="h4" gutterBottom>
          {editingPlayerId ? 'Actualizar Jugador' : 'Añadir Jugador'}
        </Typography>
        <form>
          {user.role === 'admin' && (
            <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>Seleccionar Equipo</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => handleTeamSelection(e.target.value)}
              label="Seleccionar Equipo"
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        />
        <TextField
          label="Apellidos"
          fullWidth
          margin="normal"
          value={playerSurname}
          onChange={(e) => setPlayerSurname(e.target.value)}
          required
        />
        <TextField
          label="Apodo (opcional)"
          fullWidth
          margin="normal"
          value={playerNickname}
          onChange={(e) => setPlayerNickname(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FormControl fullWidth margin="normal">
            <DesktopDatePicker
              label="Fecha de Nacimiento"
              value={birthDate}
              onChange={(newDate) => setBirthDate(newDate)}
              views={['year', 'month', 'day']}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </LocalizationProvider>
        <Typography variant="body1" gutterBottom>
          Edad: {age}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Nacionalidad</InputLabel>
          <Select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            label="Nacionalidad"
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.name}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    width="20"
                    height="15"
                    style={{ marginRight: '8px' }}
                  />
                  {country.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Dorsal"
          type="number"
          fullWidth
          margin="normal"
          value={playerNumber}
          onChange={(e) => {
            const newNumber = parseInt(e.target.value, 10);
            if (newNumber >= 1 && newNumber <= 99) {
              setPlayerNumber(newNumber);
            }
          }}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Posición</InputLabel>
          <Select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            label="Posición"
          >
            {positionsList.map((pos) => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {lateralidadOptions.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Lateralidad</InputLabel>
            <Select
              value={lateralidad}
              onChange={(e) => setLateralidad(e.target.value)}
              label="Lateralidad"
            >
              {lateralidadOptions.map((lat) => (
                <MenuItem key={lat} value={lat}>
                  {lat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          type="button"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleAddOrUpdatePlayer}
        >
          {editingPlayerId ? 'Actualizar Jugador' : 'Añadir Jugador'}
        </Button>
      </form>
    </Box>

    {/* Sección donde se muestran los jugadores añadidos */}
    <Box sx={{ width: '35%', ml: 4 }}>
      <Typography variant="h5" gutterBottom>
        Jugadores Añadidos
      </Typography>
      <List>
        {players.map((player, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={player.nickname ? player.nickname : `${player.name} ${player.surname}`}
              secondary={`Dorsal: ${player.number}, Posición: ${player.position}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditPlayer(index)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePlayer(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  </Box>
  );
};

export default AddPlayer;
