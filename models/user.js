var mongoose = require ('mongoose');
var Schrma = mongoose.Schema; 
// schema for users' login
var userSchema = new Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);