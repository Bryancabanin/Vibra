-- Users table 
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- Spotify user ID
  display_name TEXT NOT NULL
);

-- Playlists table
CREATE TABLE playlists (
  id TEXT PRIMARY KEY, 
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