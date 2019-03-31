
const request = require('request');
const fbAuth = require('./facebook_auth.js')
const mongoDB = require('./db')

module.exports = function(app) {
  // useful middleware for express
  app.use(require('morgan')('combined'));
  app.use(require('cookie-parser')());
  app.use(require('body-parser')
    .urlencoded({ extended: true }));
  app.use(require('express-session')({
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: true
  }));

  mongoDB.setup(app)  
  fbAuth.setup(app)
  console.log("******&&**")

  app.get('/', function(req, res) {
    res.render('index', {
      randnum: Math.floor(Math.random()*100),
      message: process.env.OTHER_CONFIG,
    })
  })
  
  app.get('/other', function(req, res) {
    res.render('testpage')
  })

  app.get('/search', function(req, res) {
  	let movieName = req.query.moviename
  	if (movieName) {
  		request(
  			'http://www.omdbapi.com/?t=' + movieName + '&apiKey=' + process.env.OMDB_API_KEY, 
  			(error, response, body) => {
					body = JSON.parse(body)
					console.log(body);
  				res.render('search', {
  					moviename: movieName,
  					searchresult: body
  				})
  			});
  	} else {
  		res.render('search', {moviename: movieName})
  	}
  })

  app.get('/profile',function(req, res) {
    console.log("USER", req.user)
    
    if (req.user) {
      res.render('profile', {user: req.user})
    }
    else {
      res.render('profile')
    }
  })


  
}
