import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import './CarList.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CarList() {
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
        setCurrentUser(userInfo);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await axios.get(`${BACKEND}/api/listings`);
        setListings(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchListings();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND}/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
      alert(err.response?.data?.err || 'Failed to delete listing');
    }
  }

  return (
    <div className="list-page">
      <div className="list-card card">
        <h1>Available Listings</h1>
        {listings.length === 0 && <p>No listings yet.</p>}
        <ul>
          {listings.map((l) => {
            const sellerId = l.seller && (l.seller._id ? l.seller._id : l.seller);
            const sellerUsername = l.seller && (l.seller.username ? l.seller.username : null);
            const isOwner =
              currentUser && (
                (sellerId && String(currentUser._id) === String(sellerId)) ||
                (sellerUsername && currentUser.username && sellerUsername === currentUser.username)
              );
            return (
              <li className="listing-item" key={l._id}>
                <div>
                  <Link to={`/listings/${l._id}`}>{l.title} - ${l.price} ({l.car.make} {l.car.model})</Link>
                  <div className="muted">{l.seller?.username}</div>
                </div>
                <div>
                  <button className="btn" onClick={() => navigate(`/listings/${l._id}`)}>View</button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="card-footer">
          <Link to="/create-listing" className="btn">Create listing</Link>
        </div>
      </div>
    </div>
  );
}

export default CarList;
