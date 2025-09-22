import { useState, useEffect } from 'react';
import ArtistsList from '../components/ArtistsList';
import TracksList from '../components/TracksList';

const DashboardPage = ({ token }) => {
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/dashboard-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setArtists(data.artists || []);
        setTracks(data.tracks || []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]); // Se ejecuta cada vez que el token cambia

  return (
    <div className="dashboard-container">
      <div className="dashboard-column">
        <TracksList tracks={tracks} />
      </div>
      <div className="dashboard-column">
        <ArtistsList artists={artists} />
      </div>
    </div>
  );
};

export default DashboardPage;