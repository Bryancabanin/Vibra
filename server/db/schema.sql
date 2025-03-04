-- Users table 
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- Spotify user ID
  display_name TEXT NOT NULL
);

-- Playlists table
CREATE TABLE playlists (
  id TEXT PRIMARY KEY, -- Spotify playlist ID
  name TEXT NOT NULL,
  description TEXT,
  owner_id TEXT REFERENCES users(id) ON DELETE SET NULL
);


-- Albums table
CREATE TABLE albums (
  id TEXT PRIMARY KEY,  -- Spotify album ID
  name TEXT NOT NULL,
  image_url TEXT
);

-- Artists table
CREATE TABLE artists (
  id TEXT PRIMARY KEY,  -- Spotify artist ID
  name TEXT NOT NULL
);

-- Tracks table
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,  -- Spotify track ID
  name TEXT NOT NULL,
  album_id TEXT REFERENCES albums(id) ON DELETE CASCADE,
  duration_ms INT NOT NULL,
  preview_url TEXT
);

-- Many-to-many relationship: Track & Artists
CREATE TABLE track_artists (
  track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id TEXT REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (track_id, artist_id)
);

-- Many-to-many relationship: Playlist ↔ Tracks
CREATE TABLE playlist_tracks (
  playlist_id TEXT REFERENCES playlists(id) ON DELETE CASCADE,
  track_id TEXT REFERENCES tracks(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  added_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (playlist_id, track_id)
);