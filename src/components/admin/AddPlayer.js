import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Avatar } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';  // Importar componente de MUI para seleccionar fecha
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  // Adaptador para DateFns
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Para manejo de localización
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPlayer = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [discipline, setDiscipline] = useState(''); // Disciplina del equipo
  const [playerName, setPlayerName] = useState('');
  const [playerSurname, setPlayerSurname] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());  // Por defecto seleccionamos la fecha de hoy
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [playerNumber, setPlayerNumber] = useState('');
  const [position, setPosition] = useState('');
  const [lateralidad, setLateralidad] = useState('');
  const [positionsList, setPositionsList] = useState([]);
  const [lateralidadOptions, setLateralidadOptions] = useState([]);
  const navigate = useNavigate();

  // Obtener equipos (solo administradores verán este selector)
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

  // Manejar la selección de equipo y actualizar la disciplina
  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    const selectedTeamObj = teams.find((team) => team.id === teamId);
    setDiscipline(selectedTeamObj.discipline); // Asignar la disciplina del equipo seleccionado
  };

  // Obtener lista de países en español desde una API con banderas
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
        setFilteredCountries(countryList);
      } catch (error) {
        console.error('Error al obtener la lista de países:', error);
      }
    };
    fetchCountries();
  }, []);

  // Filtrar la lista de países con el buscador
  const handleCountrySearch = (event) => {
    const searchTerm = event.target.value?.toLowerCase() || ''; // Validar si hay un valor
    const filtered = countries.filter(country => country.name.toLowerCase().includes(searchTerm));
    setFilteredCountries(filtered);
  };

  // Actualizar las posiciones y lateralidad según la disciplina
  useEffect(() => {
    if (discipline === 'Fútbol 11') {
      setPositionsList(['Portero', 'Defensa Central', 'Lateral', 'Centrocampista', 'Extremo', 'Delantero']);
    } else if (discipline === 'Fútbol 7') {
      setPositionsList(['Portero', 'Defensa', 'Centrocampista', 'Delantero']);
    } else if (discipline === 'Fútbol Sala') {
      setPositionsList(['Portero', 'Cierre', 'Ala', 'Pívot']);
    }
  }, [discipline]);

  useEffect(() => {
    if (position === 'Lateral' || position === 'Extremo') {
      setLateralidadOptions(['Izquierdo', 'Derecho']);
    } else if (position === 'Centrocampista') {
      setLateralidadOptions(['Defensivo', 'Ofensivo', 'Pivote']);
    } else {
      setLateralidadOptions([]);
    }
  }, [position]);

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

  // Manejar el envío del formulario
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const playerData = {
        name: playerName,
        surname: playerSurname,
        birthDate: birthDate,
        age: age,
        nationality: nationality,
        number: playerNumber,
        position: position,
        lateralidad: lateralidad,
        teamId: user.role === 'admin' ? selectedTeam : user.teamId,
      };
      await addDoc(collection(db, 'players'), playerData);
      alert('Jugador añadido con éxito');
      navigate('/view-teams');
    } catch (error) {
      console.error('Error al añadir jugador:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Añadir Jugador
      </Typography>
      <form onSubmit={handleAddPlayer}>
        {user.role === 'admin' && (
          <FormControl fullWidth margin="normal">
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <FormControl fullWidth margin="normal">
            <DesktopDatePicker
              label="Fecha de Nacimiento"
              value={birthDate}
              onChange={(newDate) => setBirthDate(newDate)}
              views={['year', 'month', 'day']}  // Primero selecciona el año
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </LocalizationProvider>
        <Typography variant="body1" gutterBottom>
          Edad: {age}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Seleccionar Nacionalidad</InputLabel>
          <Select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            displayEmpty
          >
            {filteredCountries.map((country) => (
              <MenuItem key={country.code} value={country.name}>
                <Avatar src={country.flag} sx={{ width: 24, height: 24, marginRight: 2 }} />
                {country.name}
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
          onChange={(e) => setPlayerNumber(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Añadir Jugador
        </Button>
      </form>
    </Box>
  );
};

export default AddPlayer;

