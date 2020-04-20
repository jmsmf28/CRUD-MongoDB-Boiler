const mongoose = require('mongoose')

const databaseUrl = 'mongodb://localhost:27017/task-app-api'

mongoose.connect(databaseUrl,
    {
      useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
