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
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search); // access the part of the query string after the ?
        const code = urlParams.get('code');

        if (!code) {
          const error = urlParams.get('error');
          throw new Error(
            error || 'No authorization code received from Spotify',
          );
        }

        // exchange code for tokens with our backend
        const response = await axios.get(
          `https://localhost:8080/api/auth/spotify/callback${location.search}`,
        );

        // store the tokens in localStorage
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem(
            'expiresIn',
            (Date.now() + response.data.expiresIn * 1000).toString(), // date now is in ms while expires in is seconds. Expires in is 3600 seconds = 60 mins. We have to convert this into ms so we multiple by 1000 since 1 second is 1000 ms. Then use toString for localStorage.
          );
          navigate('/dashboard'); // make sure this matches the endpoint with the person who is making the dashboard.
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
  }, [location.search, navigate]);

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
