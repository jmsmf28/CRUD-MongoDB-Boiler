const express = require('express');
const User = require('../models/user');

const router = new express.Router();

// signup
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken()
    res.status(201).json({
      message: 'Signup sucess! Please signin.',
      user,
      token
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
});

// login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.hashed_password
    );
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: 'That user is not on our database',
      });
    }
    res.send(user);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'hashed_password'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid Updates',
    });
  }

  try {
    const user = await User.findById(req.params.id);

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    if (!user) {
      return res.status(404).json({
        message: 'That user is not on our database',
      });
    }
    res.send(user);
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'That user is not on our database',
      });
    }
    res.send(user);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;