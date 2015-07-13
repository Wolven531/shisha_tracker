module.exports = function(db){
  /**
   * @api {get} /companies/ Get Companies
   * @apiName GetCompanies
   * @apiGroup Companies
   * @apiDescription This method gets all available companies.
   *
   * @apiSuccessExample Success-Response:
[
  {
    id: 1,
    name: "Fantasia"
  }
  ...
]
   */
  this.getCompanies = function(req, res, next){
    db.get('companies', function(data){
      res.end(JSON.stringify(data));
    });
  };

  return this;
};
