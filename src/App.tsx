import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Login from './components/Login';
import SpotifyCallback from './components/SpotifyCallback';
import Dashboard from './components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound.tsx';
import { darkTheme } from './theme.ts';
import DebugHelper from './components/DebugHelper';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        {/* Auth routes*/}
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        {/* Protected routes*/}
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="." replace />} />
            <Route path=":playlistId" element={<Dashboard />} />
            <Route path=":playlistId/sort" element={<Dashboard />} />
            <Route path='/debug' element={<DebugHelper />} />
          </Route>
        {/* </Route> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
