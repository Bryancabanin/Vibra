import { Route, Routes } from 'react-router';
import Login from './components/Login';
import SpotifyCallback from './components/SpotifyCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import DebugHelper from './components/DebugHelper';

function App() {
  return (
    <div>
      <Routes>
        {/* Auth routes*/}
        <Route path='/' element={<Login />} />
        <Route path='/callback' element={<SpotifyCallback />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/debug' element={<DebugHelper />} />
        {/* Protected routes*/}
      </Routes>
    </div>
  );
}

export default App;
