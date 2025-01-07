import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Feed from './pages/feed';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false);
    window.location.href = '/login'; // Use window.location for navigation outside Router context
  };

  return (
    <Router>
      <div>
        <h1>Ricky's Chat</h1>
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/feed">Feed</Link> | <button onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
