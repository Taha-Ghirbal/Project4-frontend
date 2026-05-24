import { useContext } from 'react'
import './Dashboard.css'

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="card">
        <h1>Welcome {user.username}</h1>
        <p className="muted">Manage your listings and profile from here.</p>
        <div className="card-footer">
          <a className="btn" href="/create-listing">Create Listing</a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard