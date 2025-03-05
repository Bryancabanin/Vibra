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
  },
);
// Get user playlists - now with proper user profile first
router.get(
  '/playlists',
  ensureAuthenticated,
  spotifyController.getCurrentUserProfile, // First get the current user profile to confirm ID
  spotifyController.getUserPlaylists, // Then get playlists
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.userPlaylist);
  },
);

// In your spotifyRoutes.js:
router.get(
  '/playlists/:id',
  ensureAuthenticated,
  spotifyController.getPlaylist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.playlist);
  },
);

router.get(
  '/playlists/:id/tracks',
  ensureAuthenticated,
  spotifyController.fetchPlaylistTracks,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.playlistTracks);
  },
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
        },
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error in debug endpoint:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
);

router.get(
  '/tracks/:id',
  spotifyController.getTracks,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.getTracks);
  },
);

router.get(
  '/artists/:id',
  spotifyController.getArtist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.artist);
  },
);

router.get(
  '/genres',
  spotifyController.getGenresFromArtist,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.genres);
  },
);

// Update your spotifyRoutes.ts file
router.get(
  '/recommendations',
  ensureAuthenticated,
  spotifyController.getRecommendations,
  (req: Request, res: Response) => {
    console.log("Sending recommendations response:", res.locals.recommendations?.length || 0);
    res.status(200).json(res.locals.recommendations);
  }
);
console.log("Registered routes:", router.stack.map(r => r.route?.path).filter(Boolean));

// Add this temporary test route to verify the endpoint is accessible
router.get(
  '/test-recommendations',
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const user = req.user as SpotifyUser;
      if (!user || !user.accessToken) {
        res.status(401).json({ error: 'Unauthorized: No access token found' });
        return;
      }

      console.log("Test endpoint - Access token available, testing Spotify API...");
      
      // Make a direct call to Spotify with a minimal valid request
      // Spotify requires at least one seed parameter (artists, tracks, or genres)
      const response = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/recommendations',
        params: {
          seed_genres: 'pop', // Using 'pop' as it's a reliable genre seed
          limit: 5
        },
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`
        }
      });
      
      console.log("Test endpoint - Successfully received recommendations");
      
      res.status(200).json({
        success: true,
        trackCount: response.data.tracks?.length || 0,
        trackSample: response.data.tracks?.slice(0, 2).map((t: any) => ({
          name: t.name,
          artist: t.artists[0].name
        })),
        requestDetails: {
          accessTokenLength: user.accessToken.length,
          tokenPrefix: user.accessToken.substring(0, 5) + '...',
          endpoint: 'https://api.spotify.com/v1/recommendations',
          params: {
            seed_genres: 'pop',
            limit: 5
          }
        }
      });
    } catch (error) {
      console.error('Test recommendations error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Spotify API error details:');
        console.error('- Status:', error.response?.status);
        console.error('- Status text:', error.response?.statusText);
        console.error('- Data:', error.response?.data);
        console.error('- Request URL:', error.config?.url);
        console.error('- Request params:', error.config?.params);
        console.error('- Request headers:', error.config?.headers);
        
        res.status(500).json({ 
          error: 'Spotify API error', 
          details: error.response?.data,
          status: error.response?.status,
          requestUrl: error.config?.url,
          requestParams: error.config?.params,
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Unknown error',
          message: error instanceof Error ? error.message : 'No error details available'
        });
      }
    }
  }
);

export default router;
