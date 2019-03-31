// database logic goes here
const Product = require('../models/movie');
const mongoose = require('mongoose');
var app = require('../index')

mongoose.connect('mongodb://localhost:27017/Movies', { useNewUrlParser: true } );

module.exports = {  // pass to routes
	setup
}


var films = new Product({ 
    title: 'Stars War',
    year: '00000000000',
    genre: 'action',
    director: 'Ken'
});

films.save().then({
    if(err) {
        return err;
    }   
});  

function setup(app) {
    app.get('/movie', function(req, res) {
        Product.find(function(err, movie) {
            res.render('movie', {title: 'Movie U LOVE', products: movie})
        })
    })
}
