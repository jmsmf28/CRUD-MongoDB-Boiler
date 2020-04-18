const express = require('express')
const mongoose = require('mongoose')


const app = express()

const connect = mongoose.connect('mongodb://localhost:27017/task',
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})