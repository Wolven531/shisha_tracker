module.exports = function(db){
  this.getSizes = function(req, res, next){
    db.get('sizes', function(data){
      res.end(JSON.stringify(data));
    });
  };

  return this;
}
