import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#f4f4f4'}}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none'}}>
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/post">Create Post</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;