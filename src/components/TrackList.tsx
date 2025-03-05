import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Grid, 
  Typography,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import axios from 'axios';
import type { Playlist, Track } from '../types.ts';

interface Props {
  playlist: Playlist;
}

const TrackList: React.FC<Props> = ({ playlist }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/spotify/playlists/${playlist.id}/tracks`,
          { withCredentials: true }
        );
        setTracks(res.data.filter((item: any) => item.track));
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [playlist.id]);

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h5">{playlist.name}</Typography>
        <Button
          variant="contained"
          startIcon={<FilterList />}
          href={`/dashboard/${playlist.id}/sort`}
        >
          Sort by Genre
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {tracks.map((track) => (
            <Grid item xs={12} sm={6} md={4} key={track.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={track.album.images?.[0]?.url}
                  alt={track.album.name}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{track.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {track.artists.map(a => a.name).join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TrackList;