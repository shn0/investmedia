const express = require('express');
const User = require('../models/User'); //import user schema
const router = express.Router();



router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

try {
  // check if the user already exists 
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // create a new user 
  const newUser = new User({ name, email, password});
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully!' });
} catch (error) {
  res.status(500).json({ message: 'Server error', error});

}

console.error('Error during registration:', error);
res.status(500).json({ message: 'Server error', error });

});

module.exports = router;