import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import {
  Box,
  CircularProgress,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';

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

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Instead of expecting tokens in the response,
        // check if the user is authenticated by making a request to your user endpoint
        const response = await axios.get(
          'http://localhost:8080/api/auth/user',
          {
            withCredentials: true, // This is crucial for sending cookies with the request
          }
        );

        if (response.data && response.data.id) {
          // User is authenticated, navigate to dashboard
          navigate('/dashboard');
        } else {
          throw new Error('Authentication failed.');
        }
      } catch (err) {
        console.error('Authentication error', err);
        setError(err instanceof Error ? err.message : 'Failed to authenticate');
        // redirect to login after 4 seconds
        setTimeout(() => navigate('/'), 4000);
      }
    };
    handleCallback();
  }, [navigate]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Applies cosistent base style across browsers */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: ' center',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        {error ? (
          // if error then we will redirect to login page after 4 seconds.
          <Typography color='error' variant='h6'>
            {error} Redirecting to login
          </Typography>
        ) : (
          <>
            <CircularProgress size={50} thickness={2} />
            <Typography variant='h6'>Authenticating with Spotify...</Typography>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SpotifyCallback;
