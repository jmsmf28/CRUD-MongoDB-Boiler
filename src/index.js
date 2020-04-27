const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const appRouter = require('./routers/app')


const app = express()

// middleware
/* // maintenance middleware
app.use((req, res, next) => {
    res.status(500).send('Be back soon! We are in maintenance!')
}) */

app.use(express.json())

// routes
app.use(userRouter)
app.use(taskRouter)
app.use(appRouter)

// // Downloading a file -- works perfect
// app.get('/download', function(req, res){
//   const file = `${__dirname}/src/upload-folder/dramaticpenguin.js`;
//   res.download(file); // Set disposition and send it.
// });

const port = process.env.PORT || 8000

app.listen(port, () =>
    console.log(`Your server is running on port ${port}`)
);