import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city'; // Import State as well

const Register = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    pin: '',
  });

  // State Management for Location
  const [states, setStates] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState(''); // Store ISO Code (e.g., 'TN')
  const [cities, setCities] = useState([]);
  
  const navigate = useNavigate();

  // 1. Load States on Component Mount
  useEffect(() => {
    const allStates = State.getStatesOfCountry('IN'); // Get all Indian states
    setStates(allStates);
  }, []);

  // 2. Handle State Selection
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedStateCode(stateCode);
    
    // Fetch cities for this specific state
    const stateCities = City.getCitiesOfState('IN', stateCode);
    setCities(stateCities);
    
    // Reset city in form data when state changes
    setFormData({ ...formData, city: '' });
  };

  // General Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pin.length !== 4) {
      return alert('PIN must be exactly 4 digits');
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          onChange={handleChange} 
          required 
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
        />
        
        <input 
          type="text" 
          name="mobile" 
          placeholder="Mobile (Optional)" 
          onChange={handleChange} 
        />

        {/* --- STATE SELECTION --- */}
        <select onChange={handleStateChange} required defaultValue="">
          <option value="" disabled>Select State</option>
          {states.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>

        {/* --- CITY SEARCH & CUSTOM INPUT --- */}
        {/* Using a datalist allows searching AND custom typing */}
        <input 
          list="city-options" 
          name="city" 
          placeholder={selectedStateCode ? "Search or Type City" : "Select State First"}
          onChange={handleChange}
          value={formData.city}
          disabled={!selectedStateCode} // Disable until state is chosen
        />
        
        <datalist id="city-options">
          {cities.map((city, index) => (
            <option key={index} value={city.name} />
          ))}
        </datalist>

        <input 
          type="text" 
          name="pin" 
          maxLength="4" 
          pattern="\d{4}" 
          placeholder="4 Digit PIN" 
          onChange={handleChange} 
          required 
        />

        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Register;