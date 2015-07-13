module.exports = function(db){
  this.getCompanies = function(req, res, next){
    db.get('companies', function(data){
      res.end(JSON.stringify(data));
    });
  };

  return this;
};
