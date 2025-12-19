import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Payment = () => {
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [details, setDetails] = useState({ card: '', cvv: '', upi: '' });

  if (!state) return <div>Invalid Access</div>;
  const { show, movie, selectedSeats, totalAmount } = state;

  const handlePay = async () => {
    // Simple Validation
    if (paymentMethod === 'card' && (!details.card || !details.cvv)) return alert("Enter Card Details");
    if (paymentMethod === 'upi' && !details.upi) return alert("Enter UPI ID");

    try {
      await axios.post('http://localhost:5000/api/movies/book', {
        showId: show._id, // Send SHOW ID, not movie ID
        seatIds: selectedSeats,
        userId: user._id
      });
      alert(`Paid via ${paymentMethod.toUpperCase()}! Booking Confirmed.`);
      navigate('/my-bookings');
    } catch (err) {
      alert("Booking Failed");
    }
  };

  return (
    <div className="payment-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto', background: 'white', marginTop: '50px' }}>
      <h2>Payment Summary</h2>
      <p><strong>Movie:</strong> {movie.title}</p>
      <p><strong>Theatre:</strong> {show.theatreName} | {show.time}</p>
      <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
      <h3>Total: ₹{totalAmount}</h3>

      <hr />
      
      <h4>Choose Payment Method</h4>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setPaymentMethod('card')} style={{ marginRight: '10px', background: paymentMethod==='card'?'#ddd':'white' }}>Card</button>
        <button onClick={() => setPaymentMethod('upi')} style={{ background: paymentMethod==='upi'?'#ddd':'white' }}>UPI</button>
      </div>

      {paymentMethod === 'card' ? (
        <div>
          <input type="text" placeholder="Card Number" onChange={e => setDetails({...details, card: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
          <input type="text" placeholder="CVV" onChange={e => setDetails({...details, cvv: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Enter UPI ID (e.g. user@oksbi)" onChange={e => setDetails({...details, upi: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        </div>
      )}

      <button onClick={handlePay} style={{ width: '100%', padding: '10px', background: '#2dc492', color: 'white', border: 'none' }}>Confirm & Pay</button>
    </div>
  );
};

export default Payment;