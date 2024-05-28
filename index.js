
const express = require('express')
const app = express()
const route = require('./routers/index.route')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser")
require("dotenv").config()

const port = process.env.PORT

const database = require("./config/database")
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser('namamn'));
database.connect()

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})