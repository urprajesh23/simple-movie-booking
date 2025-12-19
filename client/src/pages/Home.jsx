import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="home-container">
      {/* DELETED THE NAV SECTION HERE */}

      <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px', justifyContent: 'center' }}>
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card" style={{ border: '1px solid #ddd', borderRadius: '8px', width: '220px', padding: '10px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {/* <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '5px' }} 
              /> */}
              <h3 style={{ marginTop: '10px', fontSize: '1rem', color: '#333' }}>{movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;