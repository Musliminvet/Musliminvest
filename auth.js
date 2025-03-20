const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving user registration');
    } else {
      res.send('User registration saved successfully');
    }
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging in user');
    } else if (!user) {
      res.status(401).send('Invalid email or password');
    } else {
      const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!isValidPassword) {
        res.status(401).send('Invalid email or password');
      } else {
        const token = jwt.sign({ userId: user._id }, 'secretkey');
        res.send({ token });
      }
    }
  });
});

module.exports = router;