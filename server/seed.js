const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie'); 
const Show = require('./models/Show'); 
const Booking = require('./models/Booking');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo Connected for Seeding'))
  .catch(err => console.log(err));

const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  let seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= 8; i++) {
      seats.push({ id: `${row}${i}`, isBooked: false });
    }
  });
  return seats;
};

const seedDB = async () => {
  try {
    console.log("Cleaning Database...");
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    console.log("Old data deleted.");

    // 1. Insert Movies (With Working URLs)
    const leo = await new Movie({
      title: "Leo",
      description: "Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a drug cartel.",
      cast: ["Vijay", "Trisha", "Sanjay Dutt"]
    }).save();

    const jailer = await new Movie({
      title: "Jailer",
      description: "A retired jailer goes on a manhunt to find his son's killers.",
      cast: ["Rajinikanth", "Mohanlal", "Tamannaah"]
    }).save();

    const vikram = await new Movie({
      title: "Vikram",
      description: "Abc abc abc abc abc ",
      cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil"]
    }).save();

    const dude = await new Movie({
      title:"Dude",
      description:"fill description here",
      cast:["Mamitha Baiju ","Pradeep R","Sai Abhyankar"]
    }).save();

    // 2. Insert Shows (Theatres & Times)
    const shows = [
      // Leo Shows
      { movieId: leo._id, theatreName: "PVR Cinemas: Coimbatore", time: "10:00 AM", seats: generateSeats() },
      { movieId: leo._id, theatreName: "PVR Cinemas: Coimbatore", time: "06:00 PM", seats: generateSeats() },
      { movieId: leo._id, theatreName: "KG Cinemas", time: "02:30 PM", seats: generateSeats() },
      
      // Jailer Shows
      { movieId: jailer._id, theatreName: "KG Cinemas", time: "11:00 AM", seats: generateSeats() },
      { movieId: jailer._id, theatreName: "Fun Republic", time: "09:00 PM", seats: generateSeats() },

      // Vikram Shows
      { movieId: vikram._id, theatreName: "Brookefields Mall", time: "04:00 PM", seats: generateSeats() },

      //Dude Shows 
      {movieId: dude._id, theatreName: "PVR Cinemas: Coimbatore", time: "01:00 PM", seats: generateSeats() },
      {movieId: dude._id, theatreName: "Fun Republic", time: "05:00 PM", seats: generateSeats() },
      {movieId: dude._id, theatreName: "KG Cinemas", time: "08:00 PM", seats: generateSeats() },  
    ]; 

    await Show.insertMany(shows);
    console.log("Database Seeded with Movies & Shows!");
    
    mongoose.connection.close();
    process.exit();
    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();