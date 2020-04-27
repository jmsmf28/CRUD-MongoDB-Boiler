const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    actions: {
        type: String,
        default: '{ dirs:{controllers, db, models, routes, validators}, files:{}}'
    }
})

module.exports = mongoose.model('App', appSchema)