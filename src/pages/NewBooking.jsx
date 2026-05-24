import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function NewBooking() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');
  const [when, setWhen] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND}/api/bookings`, { listing: listingId, when, message }, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.err || 'Failed to create booking');
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Book a test drive</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date & time</label>
          <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required />
        </div>
        <div>
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit">Request booking</button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default NewBooking;
