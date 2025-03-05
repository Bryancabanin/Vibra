const BASE_URL = 'http://localhost:8080';

//fetch all playlists
export const getPlaylists = async () => {
  const response = await fetch(`${BASE_URL}/playlists`);
  if (!response.ok) throw new Error('Failed to fetch playlists');
  return response.json();
};

//create a new playlist
export const createPlaylist = async (name: string, description: string) => {
  const response = await fetch(`${BASE_URL}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playlistID, trackID }),
  });
  if (!response.ok) throw new Error('Failed to add song');
  return response.json();
};

//fetch artists by genre?
export const getArtistByGenre = async (genre: string) => {
  const response = await fetch(`${BASE_URL}/artists?genre=${genre}`);
  if (!response.ok) throw new Error('Failed to fetch artists');
  return response.json();
};

//filter tracks by genre
export const filterTracksByGenre = async (genre: string) => {
  const response = await fetch(`${BASE_URL}/tracks?genre=${genre}`);
  if (!response.ok) throw new Error('Failed to filter tracks');
  return response.json();
};
