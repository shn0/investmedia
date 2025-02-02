import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/all-posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.posts);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred');
      }
    };

    fetchAllPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/users/posts', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
      setPosts((prevPosts) => [...prevPosts, response.data.post]);
      setFormData({ title: '', content: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Feed</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Post</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>
              <small>By: {post.userId?.name || 'Unknown'} ({post.userId?.email || 'N/A'})</small>
            </p>
            <p><small>Posted on: {new Date(post.date).toLocaleDateString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;
