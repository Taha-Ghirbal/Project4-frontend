import { Link } from 'react-router'
import '../styles/navbar.css'

function Navbar({ user, setUser }) {

  function logOut(){
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="brand"><Link to="/" style={{color:'inherit',textDecoration:'none'}}>CarMarket</Link></div>
        <nav className="nav-links">
          <Link to="/listings">Listings</Link>
          <Link to="/bookings">My Bookings</Link>
        </nav>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
            <div className="nav-username">{user.username}</div>
            <button className="nav-btn" onClick={logOut}>Log Out</button>
          </>
        ) : (
          <>
            <Link className="nav-btn" to="/sign-in">Sign in</Link>
            <Link className="nav-btn" to="/sign-up">Sign up</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar