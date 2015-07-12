var moment = require('moment');
var db = require('./db');

function formDate(dbDate){
  return moment(dbDate).format('MMMM Do, YYYY');
}

module.exports.dbDate = function dbDate(dateObj){
  return moment(dateObj).format('YYYY-MM-DD');
};

module.exports.validateFrontDate = function(str){
  return moment(str, 'YYYY-MM-DD').isValid();
};

module.exports.prettifyFlavors = function(flavors, cb){
  db.get('sizes', function(sizes){
    db.get('companies', function(companies){
      var sizeMap = {};
      var companyMap = {};
      var blended = [];
      sizes.forEach(function(curr){
        sizeMap[curr.id] = curr.quantity;
      });
      companies.forEach(function(curr){
        companyMap[curr.id] = curr.name;
      });
      blended = flavors.map(function(curr, ind, arr){
        curr.company = companyMap[curr.company];
        curr.size = sizeMap[curr.size];
        curr.notes = curr.notes || '';
        curr.finished = curr.finished === 1;
        curr.date_bought = formDate(curr.date_bought);
        curr.date_completed = curr.finished ? formDate(curr.date_completed) : 'N/A';
        return curr;
      });
      cb(blended);
    });
  });
};

module.exports.hasRequiredParams = function(params, required){
  var errObj = {
    message: 'Missing required parameter',
    missingFields: []
  };
  required = required || [];

  for(var a = 0; a < required.length; a++) {
    if(params[required[a]] === undefined) {
      errObj.missingFields.push(required[a]);
    }
  }

  if(errObj.missingFields.length > 1) {
    errObj.message += 's';
  }

  return errObj;
}

module.exports.formDate = formDate;
