import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/movies/my-bookings/${user._id}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  // Handle Cancellation
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      await axios.post('http://localhost:5000/api/movies/cancel', { bookingId });
      alert("Ticket Cancelled!");
      fetchBookings(); // Refresh the list immediately
    } catch (err) {
      console.error(err);
      alert("Cancellation Failed");
    }
  };

  return (
    <div className="bookings-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                background: 'white'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                   {booking.showId?.movieId?.title || "Unknown Movie"}
                </h3>
                
                <p style={{ margin: '5px 0', color: '#555', fontSize: '0.9rem' }}>
                  <strong>Theatre:</strong> {booking.showId?.theatreName} <br/>
                  <strong>Time:</strong> {booking.showId?.time} <br/>
                  <strong>Seats:</strong> {booking.seatNumbers.join(', ')}
                </p>
                
                <small style={{color: '#888'}}>
                  Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                </small>
              </div>

              {/* CANCEL BUTTON */}
              <button 
                onClick={() => handleCancel(booking._id)}
                style={{ 
                  background: '#ff4d4d', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 15px', 
                  cursor: 'pointer', 
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                Cancel Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;