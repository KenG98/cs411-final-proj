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

}

