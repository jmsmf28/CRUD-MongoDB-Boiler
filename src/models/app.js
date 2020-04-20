const mongoose = require('mongoose')

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    user_id: {
        type: String,
        required: true
    },
    actions: {
        type: String,
        default:'{ dirs:{controllers, db, models, routes, validators}, files:{}}'
    }    
})

module.exports = mongoose.model('App', appSchema)