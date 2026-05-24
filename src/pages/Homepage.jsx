import React from 'react'
import './Homepage.css'

function Homepage() {
  return (
    <div className="page">
      <div className="hero card">
        <h1>Welcome to our website</h1>
        <p className="muted">Browse beautiful, well-documented listings and create your own in minutes.</p>
        <div className="card-footer">
          <a href="/listings" className="btn">See listings</a>
        </div>
      </div>
    </div>
  )
}

export default Homepage