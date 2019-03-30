var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
//blueprint for each entry we enter into database 
var schema = new Schema({
    title: {type: String, required: true},
    year: {type: String, required: true},
    genre: { type: String, required: true},
    director: {type: String, required: true},
    
});


// modules base on Schema
module.exports = mongoose.model('Product', schema); // specify name(Movie) of the model


