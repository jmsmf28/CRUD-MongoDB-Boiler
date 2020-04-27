const express = require('express')
const Apps = require('../models/app')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/auth-admin')

const router = new express.Router()

// create apps
router.post('/apps', auth, (req, res) => {
  const apps = new Apps({
    ...req.body,
    owner: req.user._id
  })

  apps.save().then(() => {
    res.status(201).json({
      message: 'App created',
      apps
    })
  }).catch((err) => {
    return res.status(400).json({
      error: err
    })
  })
})

// get own apps
router.get('/apps', auth, async (req, res) => {
  try {
    const apps = await Apps.find({
      owner: req.user._id
    })
    res.send(apps)
  } catch (e) {
    res.status(500).send()
  }

  /* Apps.find({
    owner: req.user._id
  }).then((apps) => {
    res.status(200).json({
      apps
    })
  }).catch((err) => {
    return res.status(400).json({
      error: err
    })
  }) */
})

// get own app
router.get('/apps/:id', auth, async (req, res) => {
  try {
    const apps = await Apps.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
    if (!apps) {
      return res.status(404).send()
    }

    res.send(apps)
  } catch (e) {
    res.status(500).send()
  }
})

// update apps
router.patch('/apps/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'description', 'actions']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid Updates'
    })
  }

  try {
    const apps = await Apps.findOne({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!Apps) {
      return res.status(404).json({
        message: 'That app is not on our database'
      })
    }

    updates.forEach((update) => apps[update] = req.body[update])
    await apps.save()
    res.send(apps)

  } catch (err) {
    return res.status(500).json({
      error: err
    })
  }
})

// delete apps by id
router.delete('/apps/:id', auth, async (req, res) => {
  try {
    const apps = await Apps.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    if (!apps) {
      return res.status(404).send()
    }
    res.send(apps)
  } catch (e) {
    res.status(500).send()
  }
})

// only for admin
router.get('/admin/apps', authAdmin, (req, res) => {
  Apps.find({}).then((apps) => {
    res.status(200).json({
      apps
    })
  }).catch((err) => {
    return res.status(400).json({
      error: err
    })
  })
})


module.exports = router