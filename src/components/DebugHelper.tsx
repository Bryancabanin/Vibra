import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  CircularProgress,
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

const DebugHelper: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [firstPlaylist, setFirstPlaylist] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    setDebugInfo((prevInfo) => [...prevInfo, message]);
  };

  const getSpotifyProfile = async () => {
    try {
      setLoading(true);
      addDebugInfo('Fetching Spotify profile...');

      const response = await axios.get('http://localhost:8080/api/spotify/me', {
        withCredentials: true,
      });

      setUserProfile(response.data);
      addDebugInfo(`Profile loaded - User ID: ${response.data.id}`);
      addDebugInfo(`Display name: ${response.data.display_name}`);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load Spotify profile');
      addDebugInfo(
        `Error loading profile: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
      setLoading(false);
    }
  };

  const getFirstPlaylist = async () => {
    try {
      setLoading(true);
      addDebugInfo('Fetching playlists...');

      const response = await axios.get(
        'http://localhost:8080/api/spotify/playlists',
        {
          withCredentials: true,
        }
      );

      if (
        response.data &&
        response.data.items &&
        response.data.items.length > 0
      ) {
        setFirstPlaylist(response.data.items[0]);
        addDebugInfo(`Found ${response.data.items.length} playlists`);

        const firstPl = response.data.items[0];
        addDebugInfo(`First playlist: "${firstPl.name}"`);
        addDebugInfo(
          `Owner: ${firstPl.owner.display_name} (ID: ${firstPl.owner.id})`
        );

        if (userProfile) {
          addDebugInfo(`Current user: ${userProfile.id}`);
          addDebugInfo(
            `Ownership match: ${
              userProfile.id === firstPl.owner.id ? 'YES' : 'NO'
            }`
          );
        }
      } else {
        addDebugInfo('No playlists found!');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists');
      addDebugInfo(
        `Error loading playlists: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
      setLoading(false);
    }
  };

  const getSessionInfo = async () => {
    try {
      setLoading(true);
      addDebugInfo('Fetching session info...');

      const response = await axios.get('http://localhost:8080/debug-session', {
        withCredentials: true,
      });

      addDebugInfo(`Session ID: ${response.data.sessionID}`);
      addDebugInfo(
        `Authenticated: ${response.data.authenticated ? 'YES' : 'NO'}`
      );

      if (response.data.user) {
        addDebugInfo(`User in session: ${response.data.user.id}`);
        addDebugInfo(
          `Spotify ID: ${response.data.user.spotifyId || 'Not set'}`
        );
      } else {
        addDebugInfo('No user in session');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session info');
      addDebugInfo(
        `Error loading session: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth='md' sx={{ pt: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h4' gutterBottom>
            Spotify Integration Debug Helper
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            Use this tool to debug Spotify authentication and playlist issues
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={getSpotifyProfile}
              disabled={loading}
            >
              Get Spotify Profile
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={getFirstPlaylist}
              disabled={loading}
            >
              Fetch First Playlist
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={getSessionInfo}
              disabled={loading}
            >
              Check Session
            </Button>
          </Box>

          {loading && (
            <Box display='flex' justifyContent='center' my={3}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Typography color='error' variant='body1' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant='h6' gutterBottom>
            Debug Information
          </Typography>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              bgcolor: 'rgba(0,0,0,0.1)',
              height: '300px',
              overflow: 'auto',
            }}
          >
            {debugInfo.length > 0 ? (
              debugInfo.map((info, index) => (
                <Typography
                  key={index}
                  variant='body2'
                  component='div'
                  sx={{ fontFamily: 'monospace', mb: 1 }}
                >
                  {info}
                </Typography>
              ))
            ) : (
              <Typography variant='body2' color='text.secondary'>
                Click the buttons above to start debugging
              </Typography>
            )}
          </Paper>

          {userProfile && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant='h6'>Spotify Profile</Typography>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {firstPlaylist && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant='h6'>First Playlist</Typography>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(firstPlaylist, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default DebugHelper;
