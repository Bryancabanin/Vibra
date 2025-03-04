import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import type { SpotifyUser } from '../types/spotifyUser.d.ts';

export default function configurePassport() {
  // Serialize the user to the session
  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  // Configure Spotify strategy
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: process.env.VITE_REDIRECT_URI!,
      },
      (accessToken, refreshToken, expires_in, profile, done) => {
        const user: SpotifyUser = {
          id: profile.id,
          spotifyId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          photos: profile.photos?.map((url) => ({ value: url })) ?? [],
          profileUrl: profile.profileUrl,
          accessToken,
          refreshToken,
          expires_in,
        };

        // Store tokens in the session for later use
        return done(null, user);
      },
    ),
  );
}
