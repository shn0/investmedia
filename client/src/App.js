import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './pages/feed';
import PostForm from './pages/postform';
import Profile from './pages/profile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
       <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;