import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './CreateListing.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function CreateListing() {
  const [form, setForm] = useState({ title: '', price: '', location: '', carMake: '', carModel: '', carYear: '', carMileage: '', carColor: '', carDescription: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: form.title,
        price: Number(form.price),
        location: form.location,
        carDetails: {
          make: form.carMake,
          model: form.carModel,
          year: Number(form.carYear),
          mileage: form.carMileage ? Number(form.carMileage) : undefined,
          color: form.carColor,
          description: form.carDescription,
        },
      };

  await axios.post(`${BACKEND}/api/listings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.err || 'Failed to create listing');
    }
  }

  return (
    <div className="create-page">
      <div className="create-card card">
        <h1>Create Listing</h1>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <h4>Car details</h4>
          <input name="carMake" placeholder="Make" value={form.carMake} onChange={handleChange} required />
          <input name="carModel" placeholder="Model" value={form.carModel} onChange={handleChange} required />
          <input name="carYear" placeholder="Year" type="number" value={form.carYear} onChange={handleChange} required />
          <input name="carMileage" placeholder="Mileage" type="number" value={form.carMileage} onChange={handleChange} />
          <input name="carColor" placeholder="Color" value={form.carColor} onChange={handleChange} />
          <textarea name="carDescription" placeholder="Description" value={form.carDescription} onChange={handleChange} />
        </form>

        <div className="card-footer">
          <button className="btn" onClick={handleSubmit}>Create</button>
          <button className="btn btn-outline" onClick={() => window.history.back()}>Cancel</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default CreateListing;
