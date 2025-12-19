import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Components
import Navbar from './components/Navbar'; // Import it here!

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail'; 
import Payment from './pages/Payment'; 
import MyBookings from './pages/MyBookings';

function App() {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      {/* Navbar is placed HERE so it shows on every page */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/movie/:id" element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;