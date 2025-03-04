import { Request, Response } from 'express';
import { supabase } from './supabaseClient';

interface Playlist {
  id: string;
  name: string;
  description?: string; //optional
  owner_id: string;
}

//Fetch/query all playlist
export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('playlists').select('*');
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

//Create a new playlist
export const createPlaylist = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const { data, error } = await supabase
      .from('playlists')
      .insert([{ name, description }])
      .single();
    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
