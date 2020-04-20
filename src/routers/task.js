const express = require('express')
const Task = require('../models/user')

const router = new express.Router()

router.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
      res.status(201).json({
          message: 'Task created',
          task
      })
    }).catch((err) => {
      return res.status(400).json({
        error: err
      })
    })
  })
  
router.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
      res.status(200).json({
          tasks
      })
    }).catch((err) => {
      return res.status(400).json({
        error: err
      })
    })
})

module.exports = router