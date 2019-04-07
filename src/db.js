// database logic goes here
// const Product = require('../models/movie');
const mongoose = require('mongoose');
const userModel = require('../models/user.js')

mongoose.connect('mongodb://localhost:27017/Movies', { useNewUrlParser: true } );

module.exports = {  // pass to routes
	setup,
  addUser,
  addSeenMovie,
  getUser, 
  toWatchList
}

function setup(app) {
    // app.get('/movie', function(req, res) {
    //     Product.find(function(err, movie) {
    //         res.render('movie', {title: 'Movie U LOVE', products: movie})
    //     })
    // })
}

function getUser(usrId, done) {
  userModel.findOne({"_id": usrId}, (err, usr) => done(err, usr))
  // userModel.findOne({"_id": usrId}, (err, usr) => {
  //   if (usr) {
  //     return usr
  //   }
  //   else {
  //     return null
  //   }
  // })
}

function toWatchList(userId, movieTitle, movieID) {
  userModel.findOne({ "_id": userId}, (err, usr) => {
    usr.watchList.push({ 
      name: movieTitle, 
      imdbID: movieID
    })
    userModel(usr).save((err) => {
      if(err) throw err
    })
  })
}

function addSeenMovie(userId, movieTitle, movieID) {
  userModel.findOne({"_id": userId}, (err, usr) => {
    usr.seenMovies.push({
      name: movieTitle,
      imdbID: movieID
    })
    userModel(usr).save((err) => {
      if (err) throw err
    })
  })
}

function addUser(userObj) {
  userModel.findOne({"_id": userObj.id}, (err, usr) => {
    if (usr) {
      console.log("User " + usr + " has returned.")
    }
    else {
      console.log("Adding user " + userObj + " to database.")
      let thisUser = new userModel({
        displayName: userObj.displayName,
        _id: userObj.id,
      })
      thisUser.save((err) => {
        if (err) throw err
      })    
    } 
  })
}
