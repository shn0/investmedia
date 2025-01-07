import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT token
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

  return (
    <div>
      <h1>All Posts</h1>
      {message && <p>{message}</p>}
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

export default AllPosts;
