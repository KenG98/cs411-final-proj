
const request = require('request');
const fbAuth = require('./facebook_auth.js')
const mongoDB = require('./db') // require db to routes.js
const { spawn } = require('child_process'); // for running external scripts

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

  // a user hits this endpoint to search for a movie
  // this endpoint sends a request to omdbAPI and caches the response
  // rendered in "search.pug"
  app.get('/search', function(req, res) {
    let movieName = req.query.moviename
    if (movieName) {
      mongoDB.getSearch(movieName, (err, search) => {
        // check if this movie is in the db
        if (err) {
          throw err
        }
        if (search) {
          // cache hit
          console.log('cache HIT')
          res.render('search', {
            moviename: search._id,
            searchresult: search.results,
            user: req.user
          })
        } else {
          // cache miss -- call omdbapi
          console.log('cache MISS')
          request(
            'http://www.omdbapi.com/?s=' + movieName + '&apiKey=' + process.env.OMDB_API_KEY,
            (error, response, body) => {
              body = JSON.parse(body)
              console.log(body)
              listOfMovies = body.Search
              mongoDB.addSearch({  // store response in db to cache
                query: movieName,
                results: listOfMovies
              })
              res.render('search', {
                moviename: movieName,
                searchresult: listOfMovies,
                user: req.user
              })
            })
        }
      })
    } else {
      res.render('search', {
        user: req.user
      })
    }
  })

  // may have query string "status". status=1 means display seen list
  // if "status" query does not exist, display the watch list (default)
  app.get('/profile',function(req, res) {
    if (req.user) {
      mongoDB.getUser(req.user.id, (err, usr) => {
        if (err) {
          throw err
        }
        else {
          // determine type of list to show, default is watch list
          let list = "Watch List"
          let movieList = usr.watchList

          let status = req.query.status
          if (status === "1") {
            list = "Seen List"
            movieList = usr.seenMovies;
          }
          res.render('profile', {
            user: usr,
            listOfMovies: movieList,
            listType: list
          })
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
    // note: posterURL will be the string "N/A" if movie has no poster
    if (req.user && req.query.movieName && req.query.movieID && req.query.posterURL) {
      mongoDB.addSeenMovie(req.user.id, req.query.movieName, req.query.movieID, req.query.posterURL)
      res.sendStatus(200)
    }
    else {
      res.sendStatus(400)
    }
  })

  app.get('/api/addToWatchList', (req, res) => {
    if(req.user && req.query.movieName && req.query.movieID && req.query.posterURL) {
      mongoDB.toWatchList(req.user.id, req.query.movieName, req.query.movieID, req.query.posterURL)
      res.sendStatus(200)
    }
    else {
      res.sendStatus(400)
    }
  })

  app.get('/api/removeMovie', (req, res) => {
    if (req.user && req.query.movieID && req.query.listName) {
      if (req.query.listName == "watchlist") {
        mongoDB.removeWatchlistMovie(req.user.id, req.query.movieID)
      }
      else if (req.query.listName == "seenlist") {
        mongoDB.removeSeenMovie(req.user.id, req.query.movieID)
      }
      res.sendStatus(200)
    }
    else {
      res.sendStatus(400)
    }
  })

}


