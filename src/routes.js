var request = require('request');

module.exports = function(app) {
  
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
  				console.log(body)
  				res.render('search', {
  					moviename: movieName,
  					searchresult: JSON.parse(body)
  				})
  			});
  	} else {
  		res.render('search', {moviename: movieName})
  	}
  })

}

