import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Homepage from './pages/Homepage';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import CreateListing from './pages/CreateListing';
import Bookings from './pages/Bookings';
import NewBooking from './pages/NewBooking';

function App() {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
        setUser(userInfo);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Homepage />} />
  <Route path="/sign-up" element={!user ? <SignUp setUser={setUser} /> : <Navigate to='/dashboard'/>} />
        <Route path="/sign-in" element={!user ? <SignIn setUser={setUser} /> : <Navigate to='/dashboard'/>} />
  <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to='/sign-in'/>} />
  <Route path="/listings" element={<CarList />} />
  <Route path="/listings/:id" element={<CarDetail />} />
  <Route path="/create-listing" element={user ? <CreateListing /> : <Navigate to='/sign-in'/>} />
    <Route path="/bookings" element={user ? <Bookings /> : <Navigate to='/sign-in'/>} />
    <Route path="/bookings/new" element={user ? <NewBooking /> : <Navigate to='/sign-in'/>} />

      </Routes>
    </div>
  );
}

export default App;