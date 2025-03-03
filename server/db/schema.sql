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


