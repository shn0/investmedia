const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Post = require('../models/post');

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route',
    user: req.user, // Contains the decoded JWT payload
  });
});

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET,             // Secret key
      { expiresIn: '1h' }                 // Token expiration
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create a post
router.post('/posts', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Create and save the post
    const newPost = new Post({
      userId: req.user.id, // User ID from the JWT token
      title,
      content,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all posts for the logged-in user
router.get('/posts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }); // Fetch posts by user ID
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a post
router.put('/posts/:id', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    // Validate input
    if (!title && !content) {
      return res.status(400).json({ message: 'Title or content is required to update' });
    }

    // Find the post by ID and verify ownership
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Update the post fields
    if (title) post.title = title;
    if (content) post.content = content;

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a post
router.put('/posts/:id', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  try {
    // Validate input
    if (!title && !content) {
      return res.status(400).json({ message: 'Title or content is required to update' });
    }

    // Find the post by ID and verify ownership
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Update the post fields
    if (title) post.title = title;
    if (content) post.content = content;

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a post
router.delete('/posts/:id', verifyToken, async (req, res) => {
  try {
    // Find the post by ID and verify ownership
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Delete the post
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;