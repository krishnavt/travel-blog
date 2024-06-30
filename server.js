const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/Post'); // Add this line

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/travel-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ... (existing schemas and models)

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model('Admin', adminSchema);

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Register route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new admin
  const newAdmin = new Admin({
    username,
    password: hashedPassword
  });

  app.get('/api/posts', async (req, res) => {
    console.log('Received request for posts');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const posts = await Post.find().skip(skip).limit(limit).sort({ date: -1 });
      const total = await Post.countDocuments();
  
      console.log('Fetched posts:', posts);
      console.log('Total posts:', total);
  
      res.json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  });

  try {
    await newAdmin.save();
    const token = jwt.sign({ id: newAdmin._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering new user' });
  }
});

app.post('/api/test-post', async (req, res) => {
  try {
    const testPost = new Post({
      title: 'Test Post',
      content: 'This is a test post',
      author: 'Test Author',
      category: 'Test Category'
    });
    await testPost.save();
    res.status(201).json(testPost);
  } catch (error) {
    console.error('Error creating test post:', error);
    res.status(500).json({ message: 'Error creating test post' });
  }
});

// ... (rest of your server code)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});