var db = require('../db');

module.exports.getSizes = function(req, res, next){
  db.get('sizes', function(data){
    res.end(JSON.stringify(data));
  });
};