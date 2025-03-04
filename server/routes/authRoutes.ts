import express from 'express';
import * as oAuthController from '../controllers/oAuthController';

const router = express.Router();

// Spotify OAuth routes
// The full path will be /api/auth/spotify
router.get('/spotify', oAuthController.spotifyLogin);

// The full path will be /api/auth/spotify/callback
router.get(
  '/spotify/callback',
  oAuthController.spotifyCallback,
  oAuthController.spotifyCallbackSuccess,
);

// The full path will be /api/auth/logout
router.get('/logout', oAuthController.logout);

// The full path will be /api/auth/user
router.get(
  '/user',
  oAuthController.ensureAuthenticated,
  oAuthController.getCurrentUser,
);

export default router;
