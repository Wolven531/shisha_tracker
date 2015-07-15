var Flavor = require('../models/flavor');
var util = require('../util');

module.exports = function (db) {
  /**
   * @api {get} /flavors/ Get Flavors
   * @apiName GetFlavors
   * @apiGroup Flavors
   * @apiDescription This method gets all current flavors.
   *
   * @apiSuccessExample Success-Response:
[
  {
    id: 1,
    name: 'Watermelon Molasses',
    size: '250 mg',
    company: 'Mazaya',
    cost: 11.98,
    date_bought: 'June 28th, 2015',
    bowls: 20,
    notes: 'First flavor in the app.',
    date_completed: 'July 3rd, 2015',
    finished: true
  }
  ...
]
   */
  this.getFlavors = function(req, res, next){
    db.get('flavors', function(flavors){
      db.get('sizes', function(sizes){
        db.get('companies', function(companies){
          var pretty = util.prettifyFlavors(flavors, sizes, companies);
          res.end(JSON.stringify(pretty));
        });
      });
    });
  };

  /**
   * @api {put} /flavors/:id/edit/ Edit Flavor
   * @apiName PutFlavor
   * @apiGroup Flavors
   * @apiDescription This method updates a flavor. It returns the updated object on success.
   *
   * @apiParam {int} id The flavor's unique id.
   * @apiParam {String} [name] The flavor's new name.
   * @apiParam {int} [size] The flavor's new size reference id.
   * @apiParam {String} [company] The flavor's new company reference id.
   * @apiParam {float} [cost] The flavor's new cost.
   * @apiParam {Date} [date_bought] The flavor's new date_bought.
   * @apiParam {int} [bowls] The flavor's new number of bowls.
   * @apiParam {String} [notes] The flavor's new notes.
   * @apiParam {Date} [date_completed] The flavor's new date_completed.
   * @apiParam {bool} [finished] The flavor's new finish state.
   *
   * @apiSuccessExample Success-Response:
{
  id: 7,
  name: 'test-flavor',
  size: '250 mg',
  company: 'Mazaya',
  cost: 0,
  date_bought: 'October 10th, 2015',
  bowls: '90',
  notes: 'test flavor',
  date_completed: 'N/A',
  finished: false
}
   */
  this.editFlavor = function (req, res, next) {
    var fields = [];
    var vals = [];
    if(!req.params.id) {
      res.status(400).end();
    }
    else {
      db.getSingle('flavors', req.params.id, function(flavor){
        if(flavor.length === 0) {
          res.end(JSON.stringify({error: 'That flavor doesn\'t exist'}));
          return;
        }
        flavor = new Flavor(flavor[0]);// convert to model
        for(var prop in req.body) {
          fields.push(prop);
          vals.push(req.body[prop]);
          flavor[prop] = req.body[prop];
        }
        var validationObj = flavor.validate(true);
        if(validationObj.errors.length === 0) {
          db.update('flavors', req.params.id, fields, vals, function(success){
            db.get('sizes', function(sizes){
              db.get('companies', function(companies){
                var pretty = util.prettifyFlavors([flavor], sizes, companies);
                res.status(200).end(JSON.stringify(pretty[0]));
              });
            });
          });
        }
        else {
          res.status(400).end(JSON.stringify(validationObj));
        }
      });
    }
  };

  /**
   * @api {post} /flavors/ Add Flavor
   * @apiName PostFlavor
   * @apiGroup Flavors
   * @apiDescription This adds a new flavor. It returns the updated object on success.
   *
   * @apiParam {String} name The flavor's name.
   * @apiParam {int} size The flavor's size reference id.
   * @apiParam {String} company The flavor's company reference id.
   * @apiParam {float} cost The flavor's cost.
   * @apiParam {Date} date_bought The flavor's date_bought.
   * @apiParam {int} [bowls=0] The flavor's number of bowls.
   * @apiParam {String} [notes=null] The flavor's notes.
   * @apiParam {Date} [date_completed=null] The flavor's date_completed.
   * @apiParam {bool} [finished=false] The flavor's finish state.
   *
   * @apiSuccessExample Success-Response:
{
  id: 7,
  name: 'test-flavor',
  size: '250 mg',
  company: 'Mazaya',
  cost: 0,
  date_bought: 'October 10th, 2015',
  bowls: '90',
  notes: 'test flavor',
  date_completed: 'N/A',
  finished: false
}
   */
  this.addFlavor = function(req, res, next){
    var errorObj = util.hasRequiredParams(req.body, ['name', 'size', 'company', 'cost', 'date_bought']);
    if(errorObj.missingFields.length === 0) {
      var flavor = new Flavor(req.body);
      var validationObj = flavor.validate();
      if(validationObj.errors.length === 0) {
        db.post('flavors',
          ['name', 'size', 'company', 'cost', 'date_bought', 'notes'],
          [flavor.name, flavor.size, flavor.company, flavor.cost, flavor.date_bought, flavor.notes],
          function(result){
            if(result.error) {
              res.status(400).end(JSON.stringify(result));
            }
            else {
              flavor.id = result.id;
              db.get('sizes', function(sizes){
                db.get('companies', function(companies){
                  var pretty = util.prettifyFlavors([flavor], sizes, companies);
                  res.status(200).end(JSON.stringify(pretty[0]));
                });
              });
            }
          });
      }
      else {
        res.status(400).end(JSON.stringify(validationObj));
      }
    }
    else {
      res.status(400).end(JSON.stringify(errorObj));
    }
  };

  /**
   * @api {post} /flavors/:id/addBowl Add Bowl
   * @apiName AddBowl
   * @apiGroup Flavors
   * @apiDescription This adds a bowl to a flavor. It returns the updated object on success.
   *
   * @apiSuccessExample Success-Response:
{
  id: 7,
  name: 'test-flavor',
  size: '250 mg',
  company: 'Mazaya',
  cost: 0,
  date_bought: 'October 10th, 2015',
  bowls: '90',
  notes: 'test flavor',
  date_completed: 'N/A',
  finished: false
}
   */
  this.addBowl = function(req, res, next){
    if(!req.params.id) {
      res.status(400).end();
    }
    else {
      db.getSingle('flavors', req.params.id, function(flavor){
        if(flavor.length === 0) {
          res.end(JSON.stringify({error: 'That flavor doesn\'t exist'}));
          return;
        }
        flavor = flavor[0];
        if(flavor.finished === 1) {
          res.end(JSON.stringify({error: 'Cannot add a bowl to a completed flavor'}));
        }
        else {
          flavor.bowls++;
          db.update('flavors', req.params.id, ['bowls'], [flavor.bowls], function(success){
            db.get('sizes', function(sizes){
              db.get('companies', function(companies){
                var pretty = util.prettifyFlavors([flavor], sizes, companies);
                res.status(200).end(JSON.stringify(pretty[0]));
              });
            });
          });
        }
      });
    }
  };

  /**
   * @api {post} /flavors/:id/finish Finish Bowl
   * @apiName FinishBowl
   * @apiGroup Flavors
   * @apiDescription This finishes a flavor. It returns the updated object on success.
   *
   * @apiSuccessExample Success-Response:
{
  id: 7,
  name: 'test-flavor',
  size: '250 mg',
  company: 'Mazaya',
  cost: 0,
  date_bought: 'October 10th, 2015',
  bowls: '90',
  notes: 'test flavor',
  date_completed: 'October 11th, 2015',
  finished: true
}
   */
  this.finish = function(req, res, next){
    if(!req.params.id) {
      res.status(400).end();
    }
    else {
      db.getSingle('flavors', req.params.id, function(flavor){
        if(flavor.length === 0) {
          res.end(JSON.stringify({error: 'That flavor doesn\'t exist'}));
          return;
        }
        flavor = flavor[0];
        if(flavor.finished === 1) {
          res.end(JSON.stringify({error: 'Cannot complete a completed flavor'}));
        }
        else {
          var date_completed = new Date();
          db.update('flavors', req.params.id, ['finished', 'date_completed'], [1, util.dbDate(date_completed)] , function(success){
            flavor.finished = true;
            flavor.date_completed = util.formDate(date_completed);
            db.get('sizes', function(sizes){
              db.get('companies', function(companies){
                var pretty = util.prettifyFlavors([flavor], sizes, companies);
                res.status(200).end(JSON.stringify(pretty[0]));
              });
            });
          });
        }
      });
    }
  };

  return this;  
};
