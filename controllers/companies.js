var db = require('../db');

module.exports.getCompanies = function(req, res, next){
  db.get('companies', function(data){
    res.end(JSON.stringify(data));
  });
};