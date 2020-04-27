const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/auth-admin')
const router = new express.Router()

// signup
router.post('/users', async (req, res) => {
  const user = new User(req.body)

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
    })
  }
})

// login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.hashed_password
    )
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send();
  }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// logout clear all tokens (sessions)
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// own profile
router.get('/users/me', auth, async (req, res) => res.send(req.user));

// update user
router.patch('/users/me', auth, async (req, res) => {
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
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);

  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});

// delete user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});





// only for admin
router.get('/admin/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
});


// admin login
router.post('/admin/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.hashed_password
    )
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send();
  }
})

// logout
router.post('/admin/logout', authAdmin, async (req, res) => {
  console.log(req.user.tokens)
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// list user by id
router.get('/users/:id', authAdmin, async (req, res) => {
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

module.exports = router;