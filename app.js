var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');
var routes = requireDir('./routes', {camelcase: true});
var db = require('./db');
var static = require('./static');
var port = 3015;
var app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  res.setHeader('Content-type', 'application/json');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/flavors', routes.flavors());
app.use('/sizes', routes.sizes());
app.use('/companies', routes.companies());

app.get('*', function(req, res, next){
  res
    .status(404)
    .end(JSON.stringify({error:'Page not found.'}));
});

app.listen(port, function(){
  console.log('Running on port: ' + port);
});
module.exports = app;