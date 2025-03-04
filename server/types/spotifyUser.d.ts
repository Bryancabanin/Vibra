export type SpotifyUser = {
  id: string;
  spotifyId: string;
  displayName: string;
  email?: string;
  photos?: { value: string }[];
  profileUrl?: string | null;
  accessToken?: string;
  refreshToken?: string;
  expires_in?: number;
};
