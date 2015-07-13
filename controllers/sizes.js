module.exports = function(db){
  /**
   * @api {get} /sizes/ Get Sizes
   * @apiName GetSizes
   * @apiGroup Sizes
   * @apiDescription This method gets all available container sizes.
   *
   * @apiSuccessExample Success-Response:
[
  {
    id: 1,
    quantity: "50 mg"
  }
  ...
]
   */
  this.getSizes = function(req, res, next){
    db.get('sizes', function(data){
      res.end(JSON.stringify(data));
    });
  };

  return this;
}
