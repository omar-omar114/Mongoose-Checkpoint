const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const server=mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('we are connected to mongodb'))
.catch(error => console.log('something happend:', error))

module.exports = server