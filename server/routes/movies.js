const router = require('express').Router();
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// 1. GET ALL MOVIES
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) { res.status(500).json(err); }
});

// 2. GET MOVIE DETAILS
// GET ALL MOVIES (WITH CACHING)
router.get('/', async (req, res) => {
  try {
    // 1. Try to get data from cache
    const cachedMovies = myCache.get("all-movies");
    
    if (cachedMovies) {
      console.log("⚡ Serving from Cache");
      return res.json(cachedMovies);
    }

    // 2. If not in cache, get from DB
    console.log("🐢 Serving from DB");
    const movies = await Movie.find();

    // 3. Save to cache
    myCache.set("all-movies", movies);
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET SHOWS FOR A MOVIE
router.get('/:id/shows', async (req, res) => {
  try {
    const shows = await Show.find({ movieId: req.params.id });
    res.json(shows);
  } catch (err) { res.status(500).json(err); }
});

// 4. GET SPECIFIC SHOW DETAILS
router.get('/show/:showId', async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId).populate('movieId');
    res.json(show);
  } catch (err) { res.status(500).json(err); }
});

// 5. BOOK TICKETS
router.post('/book', async (req, res) => {
  const { showId, seatIds, userId } = req.body;
  try {
    const show = await Show.findById(showId);
    
    // Check Availability
    const isAvailable = show.seats.every(seat => 
      !seatIds.includes(seat.id) || !seat.isBooked
    );

    if (!isAvailable) return res.status(400).json({message: "Seats Unavailable"});

    // Mark seats as booked
    await Show.updateOne(
      { _id: showId },
      { $set: { "seats.$[elem].isBooked": true, "seats.$[elem].bookedBy": userId } },
      { arrayFilters: [{ "elem.id": { $in: seatIds } }] }
    );

    // Create Booking
    const newBooking = new Booking({ userId, showId, seatNumbers: seatIds });
    await newBooking.save();

    res.status(200).json({message: "Booking Confirmed!"});
  } catch (err) { res.status(500).json(err); }
});

// 6. GET USER BOOKINGS
router.get('/my-bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate({
        path: 'showId', 
        populate: { path: 'movieId' }
      });
    res.json(bookings);
  } catch (err) { res.status(500).json(err); }
});

// 7. CANCEL BOOKING (Must be BEFORE module.exports)
router.post('/cancel', async (req, res) => {
  const { bookingId } = req.body;
  
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Release seats
    await Show.updateOne(
      { _id: booking.showId },
      { 
        $set: { 
          "seats.$[elem].isBooked": false, 
          "seats.$[elem].bookedBy": null 
        } 
      },
      { 
        arrayFilters: [{ "elem.id": { $in: booking.seatNumbers } }] 
      }
    );

    // Delete booking
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Ticket Cancelled Successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXPORT MUST BE AT THE VERY END ---
module.exports = router;