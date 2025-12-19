import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeatSelection from '../components/SeatSelection';
import { AuthContext } from '../context/AuthContext';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]); 
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
        const showRes = await axios.get(`http://localhost:5000/api/movies/${id}/shows`);
        setMovie(movieRes.data);
        setShows(showRes.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id]);

  const uniqueTheatres = [...new Set(shows.map(show => show.theatreName))];
  const showsForTheatre = shows.filter(show => show.theatreName === selectedTheatre);

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) return alert("Select seats first!");
    navigate('/payment', { 
      state: { 
        show: selectedShow, 
        movie: movie,
        selectedSeats, 
        totalAmount: selectedSeats.length * 200 
      } 
    });
  };

  if (!movie) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="detail-container" style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* --- MOVIE HEADER (No Image) --- */}
      <div style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', color: '#222' }}>{movie.title}</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>
          {movie.description}
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '40px' }} />

      {/* --- STEP 1: THEATRE SELECTION --- */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Step 1: Select Theatre</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {uniqueTheatres.map(theatre => (
            <button 
              key={theatre}
              onClick={() => { setSelectedTheatre(theatre); setSelectedShow(null); }}
              style={{
                padding: '12px 24px',
                background: selectedTheatre === theatre ? '#2dc492' : '#f0f0f0',
                color: selectedTheatre === theatre ? 'white' : '#333',
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '1rem',
                transition: '0.2s'
              }}
            >
              {theatre}
            </button>
          ))}
        </div>
      </div>

      {/* --- STEP 2: TIME SELECTION --- */}
      {selectedTheatre && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Step 2: Select Time</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            {showsForTheatre.map(show => (
              <button 
                key={show._id}
                onClick={() => setSelectedShow(show)} 
                style={{
                  padding: '12px 24px',
                  background: selectedShow?._id === show._id ? '#ff3e6c' : '#f0f0f0',
                  color: selectedShow?._id === show._id ? 'white' : '#333',
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {show.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- STEP 3: SEAT SELECTION --- */}
      {selectedShow && (
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{ marginBottom: '30px', color: '#333' }}>Step 3: Select Seats for {selectedShow.time}</h3>
          
          <div style={{ background: '#fafafa', padding: '30px', borderRadius: '10px', border: '1px solid #eee' }}>
            <SeatSelection 
              seats={selectedShow.seats} 
              onSelectionChange={setSelectedSeats} 
            />
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <button 
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0}
              style={{ 
                padding: '15px 40px', 
                background: selectedSeats.length > 0 ? '#ff3e6c' : '#ccc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                fontSize: '1.2rem',
                cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              Pay ₹{selectedSeats.length * 200}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;