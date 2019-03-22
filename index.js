const routes = require('./src/routes.js')
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
app.set('view engine', 'pug')
app.set('views', './views')

routes(app)
app.listen(port, () => console.log(`App listening on port ${port}`))

