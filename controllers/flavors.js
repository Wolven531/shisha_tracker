var db = require('../db');
var Flavor = require('../models/flavor');
var util = require('../util');

module.exports.getFlavors = function(req, res, next){
  db.get('flavors', function(flavors){
    db.get('sizes', function(sizes){
      db.get('companies', function(companies){
        var pretty = util.prettifyFlavors(flavors, sizes, companies);
        res.end(JSON.stringify(pretty));
      });
    });
  });
};

module.exports.editFlavor = function (req, res, next) {
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
          res.end(JSON.stringify(flavor));
        });
      }
      else {
        res.status(400).end(JSON.stringify(validationObj));
      }
    });
  }
};

module.exports.addFlavor = function(req, res, next){
  var errorObj = util.hasRequiredParams(req.body, ['name', 'size', 'company', 'cost', 'date_bought']);
  if(errorObj.missingFields.length === 0) {
    var flavor = new Flavor(req.body);
    var validationObj = flavor.validate();
    if(validationObj.errors.length === 0) {
      db.post('flavors',
        ['name', 'size', 'company', 'cost', 'date_bought'],
        [flavor.name, flavor.size, flavor.company, flavor.cost, flavor.date_bought],
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

module.exports.addBowl = function(req, res, next){
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
          res.end(JSON.stringify(flavor));
        });
      }
    });
  }
};

module.exports.finish = function(req, res, next){
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
          res.end(JSON.stringify(flavor));
        });
      }
    });
  }
};
