import express from 'express';
import {
  createPlaylist,
  getPlaylists,
} from '../controllers/playlistController';

const router = express.Router();

router.post('/', createPlaylist);

router.get('/', getPlaylists);

export default router;
