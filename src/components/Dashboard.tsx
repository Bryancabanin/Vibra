import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Typography,
  ThemeProvider,
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import PlaylistList from './PlaylistList';
import TrackList from './TrackList.tsx';
import GenreSortView from './GenreSortView.tsx';
import { darkTheme } from '../theme.ts';
import type { Playlist } from '../types.ts';
import { 
  Route, 
  Routes,   
} from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, playlistsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/auth/user', { withCredentials: true }),
          axios.get('http://localhost:8080/api/spotify/playlists', { withCredentials: true })
        ]);
        
        setUser(userRes.data);
        setPlaylists(playlistsRes.data.items);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    navigate(`/dashboard/${playlist.id}`);
  };

  const handleLogout = async () => {
    await axios.get('http://localhost:8080/api/auth/logout', { withCredentials: true });
    window.location.href = '/';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" component="h1">
              {user?.displayName}'s Playlists
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Playlist Sidebar */}
            <Grid item xs={12} md={4}>
              <PlaylistList 
                playlists={playlists}
                onSelect={handlePlaylistSelect}
                selectedId={selectedPlaylist?.id}
              />
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Routes>
                <Route path="/" element={
                  <Box sx={{ textAlign: 'center', pt: 4 }}>
                    <Typography variant="h6">
                      Select a playlist to get started
                    </Typography>
                  </Box>
                }/>
                
                <Route path="/:playlistId" element={
                  selectedPlaylist && <TrackList playlist={selectedPlaylist} />
                }/>

                <Route path="/:playlistId/sort" element={
                  selectedPlaylist && <GenreSortView playlist={selectedPlaylist} />
                }/>
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
