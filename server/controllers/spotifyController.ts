import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import type { SpotifyUser } from '../types/spotifyUser.ts';

export const fetchPlaylistTracks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const playlistId = req.params.id;
    if (!playlistId) {
      res.status(400).json({ error: 'Playlist ID is required' });
      return;
    }

    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return;
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    // Store the tracks in res.locals for the next middleware or route handler
    res.locals.playlistTracks = response.data.items;
    return next();
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    next(error);
  }
};

export const getUserPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res
        .status(401)
        .json({ error: 'Unauthorized: No access token found' });
        return;
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/users/me/playlists`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );
    res.locals.userPlaylist = response.data.items;
    return next();
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    next(error);
  }
};

export const getTracks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Expect the track id to be provided in the route parameter: /tracks/:id
    const trackId = req.params.id;
    if (!trackId) {
       res.status(400).json({ error: 'Track id is required' });
       return;
    }

    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
       res
        .status(401)
        .json({ error: 'Unauthorized: No access token found' });
        return next();
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );
    res.locals.getTracks = response.data;
    return next();
    // res.json(response.data);
  } catch (error) {
    console.error('Error fetching track data:', error);
    next(error);
  }
};

export const getGenresFromArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    // Expect the artist id to be provided in the route parameter: /artists/:id
    const artistId = req.params.id;
    if (!artistId) {
      res.status(400).json({ error: 'Artist id is required' });
      return;
    }

    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res
        .status(401)
        .json({ error: 'Unauthorized: No access token found' });
        return next();
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    res.locals.genres = response.data.genres;
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return next(error);
  }
};

// create song for each genre
export const createPlaylist = async (accessToken: string, genre: string) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const user = await response.json();

  const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${genre} Playlist`,
      description: `A playlist with ${genre} music.`,
      public: false,
    }),
  });
  const newPlaylist = await createPlaylistResponse.json();
  return newPlaylist.id;
};

export const getGenreRecommendations = async (genre: string, accessToken: string) => {
  const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=10`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const recommendations = await response.json();
  return recommendations.tracks; // Array of recommended tracks
};