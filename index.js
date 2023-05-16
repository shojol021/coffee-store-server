const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.port || 4000

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('coffie server is running')
})

app.listen(port, () => console.log('running on port', port))