import React from 'react';
import { useNavigate } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Typography,
} from '@mui/material';

// Create the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a594fd',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

// create handler for Spotify Login
const handleSpotifyLogin = () => {
  window.location.href = 'https://localhost:8080/auth/spotify';
};

const Login: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      {/* Applies cosistent base style across browsers */}
      <CssBaseline />
      {/* // box wrapper */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth='sm'>
          {/* Background around title name*/}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Title*/}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Manages text*/}
              <Typography
                variant='h4'
                component='h1'
                color='white'
                sx={{ fontWeight: 600 }}
              >
                Vibra
              </Typography>
            </Box>
            <Button
              fullWidth
              variant='contained'
              onClick={handleSpotifyLogin}
              sx={{ mb: 2, textTransform: 'none' }}
            >
              Login with Spotify
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
