// export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,  
  Typography,
  ThemeProvider,
  createTheme,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { PlayArrow, FilterList, ExitToApp } from '@mui/icons-material';

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

// Define more accurate interfaces for Spotify data types
interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

interface SpotifyUser {
  id: string;
  display_name: string;
}

interface Playlist {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks: { total: number };
  owner: SpotifyUser;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

interface PlaylistTrackObject {
  track: SpotifyTrack;
  added_at: string;
}

interface GenrePlaylist {
  id: string;
  name: string;
  genre: string;
  tracks: PlaylistTrackObject[];
}

interface RecommendedTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrackObject[]>([]);
  const [genrePlaylists, setGenrePlaylists] = useState<GenrePlaylist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Fetch user info and playlists on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get current user info
        const userResponse = await axios.get(
          'http://localhost:8080/api/auth/user',
          {
            withCredentials: true,
          }
        );
        setUser(userResponse.data);

        // Get the current user's ID for filtering
        const currentUserId = userResponse.data.id;

        // Get user's playlists
        const playlistsResponse = await axios.get(
          'http://localhost:8080/api/spotify/playlists',
          {
            withCredentials: true,
          }
        );

        // Log the first playlist to help with debugging
        if (
          playlistsResponse.data.items &&
          playlistsResponse.data.items.length > 0
        ) {
          console.log(
            'First playlist data:',
            JSON.stringify(playlistsResponse.data.items[0], null, 2)
          );
        }

        // First try to show all playlists - both owned and followed
        setPlaylists(playlistsResponse.data.items || []);

        // Just for information purposes, count how many the user actually owns
        const userOwnedPlaylists = playlistsResponse.data.items.filter(
          (playlist: Playlist) => {
            // The spotify API uses playlist.owner.id to indicate ownership
            return playlist.owner && playlist.owner.id === currentUserId;
          }
        );

        // If there are no playlists at all, show a message
        if (playlistsResponse.data.items.length === 0) {
          setNotification({
            message:
              'No playlists found. Try creating a playlist in Spotify first.',
            type: 'info',
          });
        }
        // If there are playlists but none owned by the user
        else if (userOwnedPlaylists.length === 0) {
          setNotification({
            message:
              "You don't own any playlists, but you can still work with playlists you follow.",
            type: 'info',
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your Spotify data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch playlist tracks when a playlist is selected
  useEffect(() => {
    if (selectedPlaylist) {
      fetchPlaylistTracks(selectedPlaylist);
    }
  }, [selectedPlaylist]);

  // Fetch tracks for a specific playlist
  const fetchPlaylistTracks = async (playlistId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/spotify/playlists/${playlistId}/tracks`,
        {
          withCredentials: true,
        }
      );

      // Filter out any null track objects (sometimes Spotify returns null for tracks that have been removed)
      const validTracks = response.data.filter(
        (item: PlaylistTrackObject) => item.track !== null
      );

      setPlaylistTracks(validTracks);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching playlist tracks:', err);
      setError('Failed to load playlist tracks. Please try again.');
      setLoading(false);
    }
  };

  // Handle playlist selection
  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    setGenrePlaylists([]);
    setSelectedGenre(null);
    setRecommendations([]);
  };

  // Filter tracks by genre and create playlists
  const filterByGenre = async () => {
    if (!playlistTracks.length) {
      setNotification({
        message: 'No tracks to filter',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      // Create a map to store tracks by artist ID
      const artistTracks: { [artistId: string]: PlaylistTrackObject[] } = {};

      // Group tracks by primary artist ID
      playlistTracks.forEach((item) => {
        if (item.track && item.track.artists && item.track.artists.length > 0) {
          const artistId = item.track.artists[0].id;
          if (!artistTracks[artistId]) {
            artistTracks[artistId] = [];
          }
          artistTracks[artistId].push(item);
        }
      });

      // Get artist genres
      const genreMap: { [artistId: string]: string[] } = {};
      const artistIds = Object.keys(artistTracks);

      // Fetch genres for each artist
      for (const artistId of artistIds) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/spotify/artists/${artistId}`,
            {
              withCredentials: true,
            }
          );

          // Make sure we're getting the genres property from the response
          if (response.data && response.data.genres) {
            genreMap[artistId] = response.data.genres;
          } else if (response.data) {
            // If response.data exists but no genres property, check if genres are directly in the response
            genreMap[artistId] = Array.isArray(response.data)
              ? response.data
              : [];
          } else {
            genreMap[artistId] = [];
          }
        } catch (error) {
          console.error(`Error fetching genres for artist ${artistId}:`, error);
          genreMap[artistId] = [];
        }
      }

      // Group tracks by primary genre
      const genreTracksMap: { [genre: string]: PlaylistTrackObject[] } = {};

      for (const artistId in artistTracks) {
        const tracks = artistTracks[artistId];
        const genres = genreMap[artistId] || [];

        if (genres && genres.length > 0) {
          const primaryGenre = genres[0]; // Use the first genre as primary
          if (!genreTracksMap[primaryGenre]) {
            genreTracksMap[primaryGenre] = [];
          }
          genreTracksMap[primaryGenre].push(...tracks);
        } else {
          // If no genre is found, categorize as "unknown"
          if (!genreTracksMap['unknown']) {
            genreTracksMap['unknown'] = [];
          }
          genreTracksMap['unknown'].push(...tracks);
        }
      }

      // Convert to genre playlists array
      const newGenrePlaylists: GenrePlaylist[] = [];

      for (const genre in genreTracksMap) {
        newGenrePlaylists.push({
          id: `genre-${genre}-${Date.now()}`,
          name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Playlist`,
          genre: genre,
          tracks: genreTracksMap[genre],
        });
      }

      setGenrePlaylists(newGenrePlaylists);
      setNotification({
        message: `Created ${newGenrePlaylists.length} genre-based playlists`,
        type: 'success',
      });
    } catch (err) {
      console.error('Error creating genre playlists:', err);
      setNotification({
        message: 'Failed to create genre playlists',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

 // Handle genre playlist selection - now using artist IDs for better recommendations
 const handleGenrePlaylistSelect = async (genre: string) => {
  setSelectedGenre(genre);

  try {
    setLoading(true);
    setNotification({
      message: 'Loading recommendations...',
      type: 'info',
    });

    // Find the genre playlist
    const genrePlaylist = genrePlaylists.find(p => p.genre === genre);
    
    if (!genrePlaylist) {
      throw new Error('Genre playlist not found');
    }
    
    // Get unique artist IDs from this genre's tracks (up to 5)
    const artistIds = [...new Set(
      genrePlaylist.tracks
        .filter(item => item.track && item.track.artists && item.track.artists.length > 0)
        .map(item => item.track.artists[0].id)
        .slice(0, 5)
    )];

    console.log(`Getting recommendations for genre ${genre} with ${artistIds.length} artists`);
    
    // Special handling for 'unknown' genre
    const queryGenre = genre === 'unknown' ? 'pop' : genre;

    // Call your backend endpoint with artist IDs if available
    const response = await axios.get(
      `http://localhost:8080/api/spotify/recommendations`,
      {
        params: { 
          genre: queryGenre,
          artistIds: artistIds.length > 0 ? artistIds.join(',') : undefined 
        },
        withCredentials: true,
      }
    );

    console.log(`Received ${response.data?.length || 0} recommendations`);
    
    if (response.data && response.data.length > 0) {
      setRecommendations(response.data);
      setNotification({
        message: `Found ${response.data.length} recommendations for ${genre}`,
        type: 'success',
      });
    } else {
      setRecommendations([]);
      setNotification({
        message: 'No recommendations found. Try another genre.',
        type: 'info',
      });
    }
    
    setLoading(false);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    
    // Extract error message if available
    let errorMessage = 'Failed to get recommendations';
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      errorMessage += `: ${err.response.data.error}`;
    }
    
    setNotification({
      message: errorMessage,
      type: 'error',
    });
    
    setRecommendations([]);
    setLoading(false);
  }
};
  // Save genre playlist to Spotify
  const saveGenrePlaylist = async (genre: string) => {
    if (!user || !genre) return;

    try {
      setLoading(true);

      // Get the tracks for this genre
      const genrePlaylist = genrePlaylists.find((p) => p.genre === genre);

      if (!genrePlaylist) {
        throw new Error('Genre playlist not found');
      }

      // Create a new playlist on Spotify
      const createResponse = await axios.post(
        `http://localhost:8080/api/spotify/playlists`,
        {
          name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Playlist`,
          description: `A playlist with ${genre} music.`,
        },
        {
          withCredentials: true,
        }
      );

      const newPlaylistId = createResponse.data.id;

      // Get track URIs
      const trackUris = genrePlaylist.tracks.map((item) => item.track.uri);

      // Add tracks to the playlist
      if (trackUris.length > 0) {
        await axios.post(
          `http://localhost:8080/api/spotify/playlists/${newPlaylistId}/tracks`,
          {
            trackUris: trackUris,
          },
          {
            withCredentials: true,
          }
        );
      }

      setNotification({
        message: `Playlist "${genre}" saved to your Spotify account`,
        type: 'success',
      });

      setLoading(false);
    } catch (err) {
      console.error('Error saving playlist to Spotify:', err);
      setNotification({
        message: 'Failed to save playlist to Spotify',
        type: 'error',
      });
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/api/auth/logout', {
        withCredentials: true,
      });
      // Redirect to login page
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container>
          {loading && (
            <Box display='flex' justifyContent='center' my={4}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {user && (
            <Box
              mb={4}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box>
                <Typography variant='h4' gutterBottom>
                  Welcome, {user.displayName}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  View and organize your Spotify playlists by genre
                </Typography>
              </Box>
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleLogout}
                startIcon={<ExitToApp />}
              >
                Logout
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {/* Playlists Column */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant='h6' gutterBottom>
                  Your Playlists
                </Typography>
                {playlists.length > 0 ? (
                  <List sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                    {playlists.map((playlist) => (
                      <ListItem
                        button
                        key={playlist.id}
                        onClick={() => handlePlaylistSelect(playlist.id)}
                        selected={selectedPlaylist === playlist.id}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(165, 148, 253, 0.15)',
                          },
                        }}
                      >
                        {playlist.images && playlist.images.length > 0 && (
                          <Box
                            component='img'
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              mr: 2,
                            }}
                          />
                        )}
                        <ListItemText
                          primary={playlist.name}
                          secondary={`${playlist.tracks.total} tracks${
                            playlist.owner
                              ? ` • ${playlist.owner.display_name}`
                              : ''
                          }`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    No playlists found. Try creating a playlist in Spotify
                    first.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Tracks and Genres Column */}
            <Grid item xs={12} md={8}>
              {selectedPlaylist && (
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={2}
                  >
                    <Typography variant='h6'>
                      {playlists.find((p) => p.id === selectedPlaylist)?.name}
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      startIcon={<FilterList />}
                      onClick={filterByGenre}
                      disabled={!playlistTracks.length}
                    >
                      Filter by Genre
                    </Button>
                  </Box>

                  {playlistTracks.length > 0 ? (
                    <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                      {playlistTracks.map((item, index) => (
                        <ListItem key={`${item.track.id}-${index}`}>
                          {item.track.album.images &&
                            item.track.album.images.length > 0 && (
                              <Box
                                component='img'
                                src={item.track.album.images[0].url}
                                alt={item.track.album.name}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 1,
                                  mr: 2,
                                }}
                              />
                            )}
                          <ListItemText
                            primary={item.track.name}
                            secondary={item.track.artists
                              .map((a) => a.name)
                              .join(', ')}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      No tracks in this playlist or still loading...
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Genre Playlists */}
              {genrePlaylists.length > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant='h6' gutterBottom>
                    Genre Playlists
                  </Typography>
                  <Grid container spacing={2}>
                    {genrePlaylists.map((playlist) => (
                      <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 4,
                            },
                          }}
                          onClick={() =>
                            handleGenrePlaylistSelect(playlist.genre)
                          }
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant='h6' noWrap>
                              {playlist.name}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {playlist.tracks.length} tracks
                            </Typography>
                          </CardContent>
                          <Box display='flex' justifyContent='flex-end' p={1}>
                            <Button
                              size='small'
                              color='primary'
                              onClick={(e) => {
                                e.stopPropagation();
                                saveGenrePlaylist(playlist.genre);
                              }}
                            >
                              Save to Spotify
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Recommendations */}
              {selectedGenre && (
                <Paper sx={{ p: 2 }}>
                  <Typography variant='h6' gutterBottom>
                    Recommended{' '}
                    {selectedGenre.charAt(0).toUpperCase() +
                      selectedGenre.slice(1)}{' '}
                    Tracks
                  </Typography>
                  {recommendations.length > 0 ? (
                    <List>
                      {recommendations.map((track) => (
                        <ListItem key={track.id}>
                          {track.album.images &&
                            track.album.images.length > 0 && (
                              <Box
                                component='img'
                                src={track.album.images[0].url}
                                alt={track.album.name}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 1,
                                  mr: 2,
                                }}
                              />
                            )}
                          <ListItemText
                            primary={track.name}
                            secondary={track.artists
                              .map((a) => a.name)
                              .join(', ')}
                          />
                          <IconButton
                            color='primary'
                            aria-label='play'
                            onClick={() => {
                              // Play preview logic would go here
                              setNotification({
                                message:
                                  'This would play a preview in a full implementation',
                                type: 'success',
                              });
                            }}
                          >
                            <PlayArrow />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant='body2' color='text.secondary'>
                      No recommendations available or still loading...
                    </Typography>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* Notification */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          {notification && (
            <Alert
              onClose={handleNotificationClose}
              severity={notification.type === 'error' ? 'error' : notification.type === 'info' ? 'info' : 'success'}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;