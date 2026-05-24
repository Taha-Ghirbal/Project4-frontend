import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.err || 'Failed to load bookings');
      }
    }
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Your bookings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b._id} style={{ marginBottom: 12 }}>
            <div><strong>{b.listing?.title || 'Listing'}</strong> — {new Date(b.when).toLocaleString()}</div>
            <div className="muted">Status: {b.status} — Message: {b.message}</div>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={() => navigate('/bookings/new')}>New booking</button>
    </div>
  );
}

export default Bookings;
