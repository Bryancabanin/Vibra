export interface SpotifyImage {
    url: string;
    height?: number;
    width?: number;
  }
  
  export interface Playlist {
    id: string;
    name: string;
    images: SpotifyImage[];
    tracks: {
      total: number;
    };
    owner: {
      display_name: string;
    };
  }
  
  export interface Track {
    id: string;
    name: string;
    artists: Array<{
      id: string;
      name: string;
    }>;
    album: {
      name: string;
      images: SpotifyImage[];
    };
  }