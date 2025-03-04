import { Route, Routes } from 'react-router';
import Login from './components/Login';
import SpotifyCallback from './components/SpotifyCallback';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <Routes>
        {/* Auth routes*/}
        <Route path='/' element={<Login />} />
        <Route path='/callback' element={<SpotifyCallback />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* Protected routes*/}
      </Routes>
    </div>
  );
}

export default App;
