import { Route, Routes } from 'react-router';
import Login from './components/Login';
import SpotifyCallback from './components/SpotifyCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <Routes>
        {/* Auth routes*/}
        <Route path='/' element={<Login />} />
        <Route path='/callback' element={<SpotifyCallback />} />
        {/* Protected routes*/}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
