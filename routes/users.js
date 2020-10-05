const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  verifyToken,
  isAdmin
} = require('../auth/auth');

const {
  User,
  validate
} = require('../models/user');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    error
  } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });

  if (user) return res.status(400).send('User already exist.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  return res.status(200).send(_.pick(user, ['name', 'email']));
});

router.post('/login', async (req, res) => {
  let user = await User.findOne({
    email: req.body.email
  });

  if (!user) return res.status(400).send('Invalid email/password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    profile: user.profile
  }, 'jwtPrivateKey');

  return res.status(200).send({
    token: token
  });
});

router.get('/dashboard', [verifyToken, isAdmin], (req, res) => {
  return res.status(200).send({
    message: 'Hello, Aarish!'
  });
});

module.exports = router;