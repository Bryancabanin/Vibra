import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Box, Typography } from '@mui/material';
import type { Playlist } from '../types.ts';

interface Props {
  playlists: Playlist[];
  onSelect: (playlist: Playlist) => void;
  selectedId?: string;
}

const PlaylistList: React.FC<Props> = ({ playlists, onSelect, selectedId }) => {
  return (
    <List sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: 1,
      height: '75vh',
      overflow: 'auto'
    }}>
      {playlists.map((playlist) => (
        <ListItem key={playlist.id} disablePadding>
          <ListItemButton
            selected={selectedId === playlist.id}
            onClick={() => onSelect(playlist)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(165, 148, 253, 0.15)',
              }
            }}
          >
            {playlist.images?.[0]?.url && (
              <Box
                component="img"
                src={playlist.images[0].url}
                alt={playlist.name}
                sx={{ width: 50, height: 50, borderRadius: 1, mr: 2 }}
              />
            )}
            <ListItemText
              primary={playlist.name}
              secondary={`${playlist.tracks.total} tracks`}
            />
          </ListItemButton>
        </ListItem>
      ))}
      
      {playlists.length === 0 && (
        <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
          No playlists found
        </Typography>
      )}
    </List>
  );
};

export default PlaylistList;