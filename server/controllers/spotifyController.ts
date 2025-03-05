import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import type { SpotifyUser } from '../types/spotifyUser.ts';

// Get the current user's profile (to get the correct Spotify ID)
export const getCurrentUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return;
    }

    const response = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    // Store the complete user profile
    res.locals.spotifyProfile = response.data;

    // Make sure we have the spotify ID in both places
    if (user.id !== response.data.id) {
      console.log(
        `Note: User ID mismatch between session (${user.id}) and Spotify API (${response.data.id})`
      );
    }

    // Update the user object with the correct Spotify ID if needed
    if (req.user) {
      (req.user as SpotifyUser).id = response.data.id;
    }

    return next();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    next(error);
  }
};

// export const fetchPlaylistTracks = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const playlistId = req.params.id;
//     if (!playlistId) {
//       res.status(400).json({ error: 'Playlist ID is required' });
//       return;
//     }

//     // Cast req.user as SpotifyUser to access the accessToken property
//     const user = req.user as SpotifyUser;
//     if (!user || !user.accessToken) {
//       res.status(401).json({ error: 'Unauthorized: No access token found' });
//       return;
//     }

//     const response = await axios.get(
//       `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//       {
//         headers: { Authorization: `Bearer ${user.accessToken}` },
//       }
//     );

//     // Store the tracks in res.locals for the next middleware or route handler
//     res.locals.playlistTracks = response.data.items;
//     return next();
//   } catch (error) {
//     console.error('Error fetching playlist tracks:', error);
//     next(error);
//   }
// };

//
// export const fetchPlaylistTracks = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const playlistId = req.params.id;
//     if (!playlistId) {
//       res.status(400).json({ error: 'Playlist ID is required' });
//       return;
//     }

//     // Get pagination parameters from the request
//     const limit = parseInt(req.query.limit as string) || 100;
//     const offset = parseInt(req.query.offset as string) || 0;

//     // Cast req.user as SpotifyUser to access the accessToken property
//     const user = req.user as SpotifyUser;
//     if (!user || !user.accessToken) {
//       res.status(401).json({ error: 'Unauthorized: No access token found' });
//       return;
//     }

//     const response = await axios.get(
//       `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//       {
//         params: {
//           limit,
//           offset,
//           market: 'from_token',
//         },
//         headers: { Authorization: `Bearer ${user.accessToken}` },
//       }
//     );

//     // Store the tracks in res.locals for the next middleware or route handler
//     res.locals.playlistTracks = response.data;
//     return next();
//   } catch (error) {
//     console.error('Error fetching playlist tracks:', error);
//     next(error);
//   }
// };

export const fetchPlaylistTracks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const playlistId = req.params.id;
    console.log(`Backend fetching tracks for playlist: ${playlistId}`);

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
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    console.log(
      `Spotify API returned ${response.data.items?.length || 0} tracks`
    );
    console.log('Total tracks in playlist:', response.data.total);

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
): Promise<void> => {
  try {
    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return;
    }

    // Get playlists with more details
    const response = await axios.get(
      `https://api.spotify.com/v1/me/playlists?limit=50`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    // Debugging logs
    if (
      response.data &&
      response.data.items &&
      response.data.items.length > 0
    ) {
      console.log(`Found ${response.data.items.length} playlists`);

      // Log the first playlist owner details
      const firstPlaylist = response.data.items[0];
      if (firstPlaylist.owner) {
        console.log(
          `First playlist: "${firstPlaylist.name}" owned by: ${firstPlaylist.owner.display_name} (ID: ${firstPlaylist.owner.id})`
        );
      }

      // Log user's actual ID
      console.log(`Current user ID from session: ${user.id}`);
      console.log(`Current user Spotify ID from session: ${user.spotifyId}`);
    } else {
      console.log('No playlists found or empty response');
    }

    res.locals.userPlaylist = response.data;
    return next();
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    next(error);
  }
};
///
// export const getUserPlaylists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = req.user as SpotifyUser;
//     if (!user || !user.accessToken) {
//       res.status(401).json({ error: 'Unauthorized: No access token found' });
//       return;
//     }

//     // First get the user's actual Spotify ID
//     const userProfileResponse = await axios.get(
//       `https://api.spotify.com/v1/me`,
//       {
//         headers: { Authorization: `Bearer ${user.accessToken}` },
//       }
//     );

//     const userId = userProfileResponse.data.id;
//     console.log(`Fetching playlists for user ID: ${userId}`);

//     // Use the specific endpoint to get only playlists OWNED by the user
//     const response = await axios.get(
//       `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`,
//       {
//         headers: { Authorization: `Bearer ${user.accessToken}` },
//       }
//     );

//     console.log(`Found ${response.data.items?.length || 0} owned playlists`);
//     res.locals.userPlaylist = response.data;
//     return next();
//   } catch (error) {
//     console.error('Error fetching user playlists:', error);
//     next(error);
//   }
// };

// export const getUserPlaylists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = req.user as SpotifyUser;
//     if (!user || !user.accessToken) {
//       res.status(401).json({ error: 'Unauthorized: No access token found' });
//       return;
//     }

//     // Get both the playlists the user owns and the playlists they follow
//     console.log(`Fetching playlists for user with access token`);
//     const response = await axios.get(
//       `https://api.spotify.com/v1/me/playlists?limit=50`,
//       {
//         headers: { Authorization: `Bearer ${user.accessToken}` },
//       }
//     );

//     // Debug logging
//     console.log(`API Response status: ${response.status}`);
//     console.log(`Response data type: ${typeof response.data}`);
//     console.log(`Response data has items: ${Boolean(response.data?.items)}`);
//     console.log(`Found ${response.data?.items?.length || 0} playlists total`);

//     // Set the response
//     res.locals.userPlaylist = response.data;
//     return next();
//   } catch (error) {
//     console.error('Error fetching user playlists:', error);
//     if (axios.isAxiosError(error)) {
//       console.error('Axios error details:', error.response?.data);
//       res.status(error.response?.status || 500).json({
//         error: 'Error fetching playlists',
//         details: error.response?.data,
//       });
//     } else {
//       next(error);
//     }
//   }
// };

// test
// In your spotifyController.js:
export const getPlaylist = async (
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

    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return;
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    res.locals.playlist = response.data;
    return next();
  } catch (error) {
    console.error('Error fetching playlist:', error);
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
      res.status(401).json({ error: 'Unauthorized: No access token found' });
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
): Promise<void> => {
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
      res.status(401).json({ error: 'Unauthorized: No access token found' });
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

export const getArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return next();
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    res.locals.artist = response.data;
    return next();
  } catch (error) {
    console.error('Error fetching artist data:', error);
    next(error);
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

  const createPlaylistResponse = await fetch(
    `https://api.spotify.com/v1/users/${user.id}/playlists`,
    {
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
    }
  );
  const newPlaylist = await createPlaylistResponse.json();
  return newPlaylist.id;
};

// Helper function to create a new playlist for a genre
export const createGenrePlaylist = async (
  accessToken: string,
  genre: string,
  userId: string
) => {
  try {
    const createPlaylistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Playlist`,
        description: `A playlist with ${genre} music created by Vibra.`,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return createPlaylistResponse.data.id;
  } catch (error) {
    console.error('Error creating genre playlist:', error);
    throw error;
  }
};

// Create genre-specific playlists for a user
export const createGenrePlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { genres, tracks } = req.body;

    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      res.status(400).json({ error: 'Genres array is required' });
      return;
    }

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      res.status(400).json({ error: 'Tracks array is required' });
      return;
    }

    // Cast req.user as SpotifyUser to access the accessToken property
    const user = req.user as SpotifyUser;
    if (!user || !user.accessToken) {
      res.status(401).json({ error: 'Unauthorized: No access token found' });
      return;
    }

    // Get user ID
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    const userId = userResponse.data.id;

    // Create playlists for each genre and store results
    const results = [];

    for (const genre of genres) {
      // Create a new playlist for this genre
      const playlistId = await createGenrePlaylist(
        user.accessToken,
        genre,
        userId
      );

      // Find tracks for this genre
      const genreTracks = tracks.filter((track) => track.genre === genre);

      // Add tracks to the playlist if we have any
      if (genreTracks.length > 0) {
        const trackUris = genreTracks.map((track) => track.uri);

        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          { uris: trackUris },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      results.push({
        genre,
        playlistId,
        trackCount: genreTracks.length,
      });
    }

    res.locals.genrePlaylists = results;
    next();
  } catch (error) {
    console.error('Error creating genre playlists:', error);
    next(error);
  }
};

export const getGenreRecommendations = async (
  genre: string,
  accessToken: string
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=10`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const recommendations = await response.json();
  return recommendations.tracks; // Array of recommended tracks
};
