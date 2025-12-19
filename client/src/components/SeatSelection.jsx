import React, { useState } from 'react';
import '../index.css'; // We will add styles below

const SeatSelection = ({ seats, onSelectionChange }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    // CASE 2: If seat is unavailable, do nothing (or show alert)
    if (seat.isBooked) return;

    let updatedSelection;
    if (selectedSeats.includes(seat.id)) {
      // Unselect if already selected
      updatedSelection = selectedSeats.filter(id => id !== seat.id);
    } else {
      // Select the seat
      updatedSelection = [...selectedSeats, seat.id];
    }

    setSelectedSeats(updatedSelection);
    onSelectionChange(updatedSelection); // Inform parent component
  };

  return (
    <div className="cinema-container">
      <div className="screen-display">SCREEN THIS WAY</div>
      
      <div className="seats-grid">
        {seats.map((seat) => (
          <div
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            className={`seat-box 
              ${seat.isBooked ? 'booked' : 'available'} 
              ${selectedSeats.includes(seat.id) ? 'selected' : ''}`
            }
          >
            {seat.id}
          </div>
        ))}
      </div>
      

    </div>
  );
};

export default SeatSelection;