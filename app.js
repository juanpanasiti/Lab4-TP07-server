const express = require('express')
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv/config')

app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json())
app.use(cors())
//Import Routes
const homeRoutes = require('./routes/home')
app.use('/home', homeRoutes)

const producsRoutes = require('./routes/products')
app.use('/products', producsRoutes)


//ROUTES
app.get('/', (req,res) => {
    res.send("HOME")
})

//Connect to DB
mongoose.connect(
    process.env.DB_CONN,
    { useNewUrlParser: true },
    () => console.log('Connected to MongoDB!')
)

//port
app.listen(3002)