import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  Grid,
  Avatar
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [country, setCountry] = useState(null);
  const [discipline, setDiscipline] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [countries, setCountries] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();  // Hook para redirigir

  // Obtener países desde la API
  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countryOptions = response.data.map(country => ({
        label: country.translations.spa.common,
        value: country.cca2,
        flag: country.flags.svg,
      }));
      setCountries(countryOptions);
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  };

  // Manejar la subida de archivo y previsualización
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    // Crear una previsualización del archivo subido
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Enviar el formulario y redirigir después de crear el equipo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName || !country || !discipline) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    try {
      // Guardar equipo en Firestore
      await addDoc(collection(db, 'teams'), {
        name: teamName,
        country: country.label,
        discipline: discipline,
        description: description,
        logo: logo ? URL.createObjectURL(logo) : 'ruta/escudo/generico.png',
      });

      setSuccessMessage(`Equipo "${teamName}" creado con éxito`);
      setTeamName('');
      setCountry(null);
      setDiscipline('');
      setDescription('');
      setLogo(null);
      setLogoPreview(null);

      // Redirigir a la página principal o a otra página después de crear el equipo
      navigate('/');  // Redirige al home o cambia la ruta si prefieres otra página
    } catch (error) {
      setErrorMessage('Error al crear el equipo');
      console.error('Error al crear el equipo:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const Input = styled('input')({
    display: 'none',
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Equipo
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nombre del Equipo"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>País</InputLabel>
          <MuiSelect
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            label="País"
            renderValue={(selected) => 
              selected ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={selected.flag}
                    alt={`Flag of ${selected.label}`}
                    style={{ width: '20px', marginRight: '10px' }}
                  />
                  {selected.label}
                </div>
              ) : ''
            }
          >
            {countries.map((option) => (
              <MenuItem key={option.value} value={option}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={option.flag}
                    alt={`Flag of ${option.label}`}
                    style={{ width: '20px', marginRight: '10px' }}
                  />
                  {option.label}
                </div>
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Disciplina</InputLabel>
          <MuiSelect
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            label="Disciplina"
            required
          >
            <MenuItem value="Fútbol 11">Fútbol 11</MenuItem>
            <MenuItem value="Fútbol 7">Fútbol 7</MenuItem>
            <MenuItem value="Fútbol Sala">Fútbol Sala</MenuItem>
          </MuiSelect>
        </FormControl>
        <TextField
          fullWidth
          label="Descripción (opcional)"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <label htmlFor="logo-upload">
          <Input accept="image/*" id="logo-upload" type="file" onChange={handleLogoUpload} />
          <Button variant="contained" component="span" fullWidth sx={{ mt: 2 }}>
            Subir Escudo
          </Button>
        </label>

        {logoPreview && (
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Avatar alt="Logo Preview" src={logoPreview} sx={{ width: 100, height: 100 }} />
          </Grid>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 4 }}>
          Crear Equipo
        </Button>

        {successMessage && (
          <Typography variant="h6" color="green" sx={{ mt: 2 }}>
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default CreateTeam;
