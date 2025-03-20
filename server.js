const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/musliminvest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const investmentRoutes = require('./routes/investment');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/investment', investmentRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});