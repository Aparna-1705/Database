// index.js
// Assignment: Creating a REST API using ExpressJS and Mongoose

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/postsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once('open', () => console.log('MongoDB connected successfully'))
  .on('error', (err) => console.error('MongoDB connection error:', err));

// Schema Definition
const schema = mongoose.Schema({
  title: String,
  content: String,
});

// Model Creation
const Post = mongoose.model('Post', schema);

// Routes

// i) GET route to display all posts
app.get('/getPosts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ii) POST route to add a new post
app.post('/addPosts', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// iii) DELETE route to delete a post by ID
app.delete('/delPosts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// iv) PATCH route to update a particular post
app.patch('/post/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
