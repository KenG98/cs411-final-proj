
const request = require('request');
const fbAuth = require('./facebook_auth.js')
const mongoDB = require('./db') // require db to routes.js

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

  mongoDB.setup(app)   // give route to modle mongoDB,express app
  fbAuth.setup(app)  // pass function from db.js
  

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
  			'http://www.omdbapi.com/?s=' + movieName + '&apiKey=' + process.env.OMDB_API_KEY, 
  			(error, response, body) => {
					body = JSON.parse(body)
				  listOfMovies = body.Search
					console.log(listOfMovies);
  				res.render('search', {
  					moviename: movieName,
  					searchresult: listOfMovies,
            user: req.user
  				})
  			});
  	} else {
  		res.render('search', {
        moviename: movieName,
        user: req.user
      })
  	}
  })

  app.get('/profile',function(req, res) {
    if (req.user) {
      mongoDB.getUser(req.user.id, (err, usr) => {
        if (err) {
          throw err
        }
        else {
          res.render('profile', {user: usr})
        }
      })
    }
    else {
      res.render('profile')
    }
  })
 
  // shows a dummy list of movies (request copied from search)
  app.get('/recommend', function(req, res) {
  	request(
  		'http://www.omdbapi.com/?s=' + 'Star Wars' + '&apiKey=' + process.env.OMDB_API_KEY, 
  		(error, response, body) => {
				body = JSON.parse(body)
				listOfMovies = body.Search
  			res.render('recommend', {
  				searchresult: listOfMovies,
          user: req.user
  			})
  		});
  })

  app.get('/api/addSeenMovie', (req, res) => {
    if (req.user && req.query.movieName && req.query.movieID) {
      mongoDB.addSeenMovie(req.user.id, req.query.movieName, req.query.movieID)
      res.sendStatus(200)
    }
    else {
      res.sendStatus(400)
    }  
  })

  app.get('/api/addToWatchList', (req, res) => {
    if(req.user && req.query.movieName && req.query.movieID) {
      mongoDB.toWatchList(req.user.id, req.query.movieName, req.query.movieID)
      res.sendStatus(200)
    } 
    else {
      res.sendStatus(400)
    } 
  
  })

}


