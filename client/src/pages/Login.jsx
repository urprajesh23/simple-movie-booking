import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const { dispatch } = useContext(AuthContext); // Access global state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' }); // Set loading state

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, pin });
      
      // If successful, update global context with user data
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      navigate('/'); // Redirect to Home
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', payload: err.response?.data });
      alert(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Enter Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          maxLength="4"
          placeholder="4 Digit PIN" 
          value={pin}
          onChange={(e) => setPin(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>New user? <a href="/register">Create Account</a></p>
    </div>
  );
};

export default Login;