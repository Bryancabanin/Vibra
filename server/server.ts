import express from 'express';
import cors from 'cors';
import {
  notFoundMiddleware,
  errorHandler,
} from './middlewares/errorMiddleware';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import configurePassport from './config/passportConfig';
import authRoutes from './routes/authRoutes';
import 'dotenv/config';
import playlistRoutes from './routes/playlistRoutes';

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and credentials
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
configurePassport();

// API routes
app.use('/api/auth', authRoutes);

// Other routes
app.get('/', (_req, res) => {
  res.send('Spotify API Server is running');
});

// 404 or "Not Found" Handler
app.use(notFoundMiddleware);

// 500 or "Internal Server Error" Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.use('/playlists', playlistRoutes);

export default app;
