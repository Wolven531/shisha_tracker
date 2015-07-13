var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');
var routes = requireDir('./routes', {camelcase: true});
var db = require('./db');
var port = 3015;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  next();
});

// For docs, this must be above the Content-type header
app.use('/', express.static('docs'));
app.use('/docs', express.static('docs'));
// All other responses should be JSON
app.use(function(req, res, next){
  res.setHeader('Content-type', 'application/json');
  next();
});

app.use('/flavors', routes.flavors(db));
app.use('/sizes', routes.sizes(db));
app.use('/companies', routes.companies(db));

app.get('*', function(req, res, next){
  res
    .status(404)
    .end(JSON.stringify({error:'Page not found.'}));
});

app.listen(port, function(){
  console.log('Running on port: ' + port);
});
module.exports = app;