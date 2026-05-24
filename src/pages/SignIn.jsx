import { useState } from 'react';
import './SignIn.css'
import axios from 'axios';
import { useNavigate } from 'react-router';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
  const response = await axios.post(`${BACKEND}/auth/sign-in`, formData);
      const token = response.data.token;

      const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
      setUser(userInfo);
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.response?.data?.err || 'An error occurred during sign in');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-center">
        <div className="auth-card card">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </form>

          <div className="card-footer">
            <button className="btn" onClick={handleSubmit}>Sign In</button>
          </div>

          {errorMessage && <p style={{ color: 'red' }} role="alert">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default SignIn;