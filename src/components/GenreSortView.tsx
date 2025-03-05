import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Grid, 
  Typography,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import TrackList from './TrackList';
import type { Playlist, Track } from '../types.ts';

interface Props {
  playlist: Playlist;
}

interface GenreData {
  name: string;
  tracks: Track[];
}

const GenreSortView: React.FC<Props> = ({ playlist }) => {
  const [genres, setGenres] = useState<GenreData[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/spotify/playlists/${playlist.id}/genres`,
          { withCredentials: true }
        );
        setGenres(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, [playlist.id]);

  const fetchRecommendations = async (genre: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/spotify/recommendations?genre=${genre}`,
        { withCredentials: true }
      );
      setRecommendations(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5">Genres in {playlist.name}</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        {genres.map((genre) => (
          <Chip
            key={genre.name}
            label={genre.name}
            onClick={() => {
              setSelectedGenre(genre.name);
              fetchRecommendations(genre.name);
            }}
            color={selectedGenre === genre.name ? 'primary' : 'default'}
            sx={{ m: 0.5, cursor: 'pointer' }}
          />
        ))}
      </Box>

      {selectedGenre && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {selectedGenre} Recommendations
          </Typography>
          
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {recommendations.map((track) => (
                <Grid item xs={12} sm={6} md={4} key={track.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{track.name}</Typography>
                      <Typography variant="body2">
                        {track.artists.map(a => a.name).join(', ')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GenreSortView;