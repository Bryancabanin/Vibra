import express, { Request, Response } from 'express';
import { ensureAuthenticated } from '../controllers/oAuthController';
import * as spotifyController from '../controllers/spotifyController';
import axios from 'axios';
import type { SpotifyUser } from '../types/spotifyUser.ts';

const router = express.Router();

// Get current user's Spotify profile
router.get(
  '/me',
  ensureAuthenticated,
  spotifyController.getCurrentUserProfile,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.spotifyProfile);
  }
);
// Get user playlists - now with proper user profile first
router.get(
  '/playlists',
  ensureAuthenticated,
  spotifyController.getCurrentUserProfile, // First get the current user profile to confirm ID
  spotifyController.getUserPlaylists, // Then get playlists
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.userPlaylist);
  }
);

// In your spotifyRoutes.js:
router.get(
  '/playlists/:id',
  ensureAuthenticated,
  spotifyController.getPlaylist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.playlist);
  }
);

router.get(
  '/playlists/:id/tracks',
  ensureAuthenticated,
  spotifyController.fetchPlaylistTracks,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.playlistTracks);
  }
);

// Add this to your spotifyRoutes.js:
router.get(
  '/debug/playlist/:id',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as SpotifyUser;
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${req.params.id}/tracks?limit=100`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error in debug endpoint:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
);

router.get(
  '/tracks/:id',
  spotifyController.getTracks,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.getTracks);
  }
);

router.get(
  '/artists/:id',
  spotifyController.getArtist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.artist);
  }
);

router.get(
  '/genres',
  spotifyController.getGenresFromArtist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.genres);
  }
);

export default router;
