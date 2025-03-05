import express, { Request, Response }  from 'express';
import { ensureAuthenticated } from '../controllers/oAuthController';
import * as spotifyController from '../controllers/spotifyController';

const router = express.Router();

router.get('/playlists', spotifyController.getUserPlaylists, (req: Request, res: Response) =>{
  res.status(200).json(res.locals.userPlaylist)
});

router.get('/playlists/:id/tracks', ensureAuthenticated, spotifyController.fetchPlaylistTracks, (req: Request, res: Response) => {
  res.status(200).json(res.locals.playlistTracks);
});

router.get('/tracks/:id', spotifyController.getTracks, (req: Request, res: Response) =>{
  res.status(200).json(res.locals.getTracks)
});

router.get('/genres', spotifyController.getGenresFromArtist, (req: Request, res: Response) =>{
  res.status(200).json(res.locals.genres)
});



export default router;