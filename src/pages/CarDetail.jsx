import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import './CarDetail.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CarDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
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
    async function fetchListing() {
    try {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await axios.get(`${BACKEND}/api/listings/${id}`, headers ? { headers } : undefined);
        setListing(res.data);
        
        const c = res.data.car || {};
        setForm({
          title: res.data.title || '',
          price: res.data.price || '',
          location: res.data.location || '',
          condition: res.data.condition || 'used',
          carMake: c.make || '',
          carModel: c.model || '',
          carYear: c.year || '',
          carMileage: c.mileage || '',
          carColor: c.color || '',
          carDescription: c.description || '',
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchListing();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: form.title,
        price: Number(form.price),
        location: form.location,
        condition: form.condition,
        carDetails: {
          make: form.carMake,
          model: form.carModel,
          year: Number(form.carYear),
          mileage: form.carMileage ? Number(form.carMileage) : undefined,
          color: form.carColor,
          description: form.carDescription,
        },
      };

  await axios.put(`${BACKEND}/api/listings/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await axios.get(`${BACKEND}/api/listings/${id}`, headers ? { headers } : undefined);
      setListing(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.err || 'Failed to update listing');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
  await axios.delete(`${BACKEND}/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.err || 'Failed to delete listing');
    }
  }

  if (!listing || !form) return <div>Loading...</div>;

  
  const sellerId = listing.seller && (listing.seller._id ? listing.seller._id : listing.seller);
  const sellerUsername = listing.seller && (listing.seller.username ? listing.seller.username : null);
  const localIsOwner =
    currentUser && (
      (sellerId && String(currentUser._id) === String(sellerId)) ||
      (sellerUsername && currentUser.username && sellerUsername === currentUser.username)
    );
  const isOwner = (listing.isOwner === true) || localIsOwner;

  console.debug('CarDetail debug:', { currentUser, seller: listing.seller, sellerId, isOwner });

  return (
    <div className="detail-page">
      <div className="detail-card card">
        {!editing ? (
          <div>
            <h1>{listing.title}</h1>
            <p>Price: ${listing.price}</p>
            <p>Seller: {listing.seller?.username}</p>
            <p>Car: {listing.car?.make} {listing.car?.model} ({listing.car?.year})</p>
            <p>Location: {listing.location}</p>
            <p>Description: {listing.car?.description}</p>
            <p>Mileage: {listing.car?.mileage}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <h2>Edit Listing</h2>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <select name="condition" value={form.condition} onChange={handleChange}>
              <option value="used">Used</option>
              <option value="new">New</option>
            </select>

            <h4>Car details</h4>
            <input name="carMake" placeholder="Make" value={form.carMake} onChange={handleChange} required />
            <input name="carModel" placeholder="Model" value={form.carModel} onChange={handleChange} required />
            <input name="carYear" placeholder="Year" type="number" value={form.carYear} onChange={handleChange} required />
            <input name="carMileage" placeholder="Mileage" type="number" value={form.carMileage} onChange={handleChange} />
            <input name="carColor" placeholder="Color" value={form.carColor} onChange={handleChange} />
            <textarea name="carDescription" placeholder="Description" value={form.carDescription} onChange={handleChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="card-footer" style={{ marginTop: '12px' }}>
              <button className="btn" type="submit">Save</button>
              <button className="btn btn-outline" type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="card-footer">
          <div className="footer-left">
            {isOwner && !editing && (
              <>
                <button className="btn" onClick={() => setEditing(true)}>Edit</button>
                <button className="btn btn-outline" onClick={handleDelete} style={{ marginLeft: '8px' }}>Delete</button>
              </>
            )}
          </div>

          <div className="footer-right">
            {!editing && (
              <>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
                <button className="btn" onClick={() => navigate(`/bookings/new?listing=${listing._id}`)}>Book test drive</button>
              </>
            )}

            {editing && null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetail;
