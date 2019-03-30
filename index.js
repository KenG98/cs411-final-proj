const Product = require('./models/movie');
const routes = require('./src/routes.js')
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const db = require('./src/db');
app.use('/db', db);                  // to ./db
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('./public'))  // store front-end files in ./public
const mongoose = require('mongoose');
routes(app)

mongoose.connect('mongodb://localhost:27017/Movies' );


app.get('/movie', function(req, res, next) {
    Product.find(function(err, movie ) {
        res.render('./movie',{title: 'Movie U LOVE', products: movie})
    })
  })

var films = new Product({ 
    title: 'Stars War',
    year: '203222211212143',
    genre: 'action',
    director: 'Ken'
});


films.save().then({
    if(err) {
        return err;
    }  
});




app.listen(port, () => console.log(`App listening on port ${port}`))
