import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../index.css'; // Ensure you have styles if needed

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem', 
      background: '#333', 
      color: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
        MovieApp
      </Link>
      
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Hello, {user.name}</span>
            <Link to="/my-bookings" style={{ color: '#ccc', textDecoration: 'none' }}>My Bookings</Link>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: '#ff4d4d', 
                color: 'white', 
                border: 'none', 
                padding: '8px 15px', 
                borderRadius: '5px',
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            style={{ 
              background: '#2dc492', 
              color: '#fff', 
              padding: '8px 20px', 
              borderRadius: '5px', 
              textDecoration: 'none' 
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;