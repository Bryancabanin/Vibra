import { Route, Routes } from 'react-router';
import Login from './components/Login';
import SpotifyCallback from './components/SpotifyCallback';

function App() {
  return (
    <div>
      <Routes>
        {/* Auth routes*/}
        <Route path='/' element={<Login />} />
        <Route path='/callback' element={<SpotifyCallback />} />
        {/* Protected routes*/}
      </Routes>
    </div>
  );
}

export default App;
