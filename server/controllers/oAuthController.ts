import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import type { SpotifyUser } from '../types/spotifyUser.d.ts';
import 'dotenv/config';

// Interface for the authentication call.
interface SpotifyAuthOptions extends passport.AuthenticateOptions {
  showDialog?: boolean;
}

/**
 * Initiates the Spotify OAuth authentication flow.
 * This will redirect the user to the Spotify login page.
 */
export const spotifyLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const options: SpotifyAuthOptions = {
    scope: [
      'user-read-email',
      'user-read-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-library-read',
      'user-library-modify',
      'user-top-read',
    ],
    showDialog: true,
  };

  passport.authenticate('spotify', options)(req, res, next);
};

/**
 * Handles the callback from Spotify after authorization.
 * This will create a session and redirect the user.
 */
export const spotifyCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passport.authenticate('spotify', { failureRedirect: '/login' })(
  passport.authenticate('spotify', { failureRedirect: '/' })(req, res, next);
};

/**
 * Completes the authentication process after successful Spotify authentication.
 * Redirects to the frontend application.
 */
export const spotifyCallbackSuccess = (req: Request, res: Response) => {
  // Log successful authentication
  console.log('Authentication successful for user:', req.user);
  res.redirect(process.env.FRONT_END_URL || 'http://localhost:5173');
};

/**
 * Logs out the user by destroying the session.
 */
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
    }
    // Cast req as any to access session.destroy because the default Request type does not include session.
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect(process.env.FRONT_END_URL || 'http://localhost:5173');
    });
  });
};

/**
 * Middleware to ensure a user is authenticated before proceeding.
 * Use this on routes that require authentication.
 */
export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('json')) {
    res.status(401).json({ error: 'Not authenticated' });
  } else {
    // res.redirect('/login');
    res.redirect('/');
  }
};

/**
 * Returns the current user's info if authenticated.
 */
export const getCurrentUser = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    // Return a cleaner user object without tokens
    const user = req.user as SpotifyUser;
    res.json({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      profileUrl: user.profileUrl,
      photos: user.photos,
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};
