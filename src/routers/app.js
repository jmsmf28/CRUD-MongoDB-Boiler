const express = require('express')
const Apps = require('../models/app')

const router = new express.Router()

router.post('/apps', (req, res) => {
    const apps = new Apps(req.body);
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
  
router.get('/apps', (req, res) => {
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
  
router.get('/apps/:id', (req, res) => {
    Apps.findById(req.params.id).then((apps) => {
      if(!apps){
        return res.status(404).json({
          message:'That app is not on our database'
        })
      }
      res.json({
          apps
      })
    }).catch((err) => {
      return res.status(500).json({
        error: err
      })
    })
})
     
router.delete('/apps/:id', (req, res) => {
    Apps.findByIdAndDelete(req.params.id).then((apps) => {
      if(!apps){
        return res.status(404).json({
          message:'That app is not on our database'
        })
      }
      return Apps.countDocuments({ completed: false})
    }).then((result) => {
      console.log(result, 'App deleted')
      next()
    }).catch((err) => {
      return res.status(500).json({
        error: err
      })
    })
})

module.exports = router