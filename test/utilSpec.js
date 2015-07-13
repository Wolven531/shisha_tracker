var util = require('../util');
var Flavor = require('../models/flavor');

describe('Util', function() {
  var sizes = [{id: 1, quantity: '50 mg'}];
  var companies = [{id: 1, name: 'Fantasia'}];

  it('should convert a DB date into a user-friendly version', function() {
    expect(util.formDate(new Date(2015, 6, 1))).toEqual('July 1st, 2015');
  });

  it('should convert a Date object into a DB-friendly version', function() {
    expect(util.dbDate(new Date(2015, 6, 1))).toEqual('2015-07-01');
  });

  it('should only validate YYYY-MM-DD formatted date strings', function() {
    expect(util.validateFrontDate(null)).toBe(false);
    expect(util.validateFrontDate('')).toBe(false);
    expect(util.validateFrontDate('7/10/2015')).toBe(false); // improper format
    expect(util.validateFrontDate('2015-07-00')).toBe(false);// lower bound for day exceeded
    expect(util.validateFrontDate('2015-07-32')).toBe(false);// upper bound for day exceeded 
    expect(util.validateFrontDate('2015-00-01')).toBe(false);// lower bound for month exceeded
    expect(util.validateFrontDate('2015-13-01')).toBe(false);// upper bound for month exceeded
    expect(util.validateFrontDate('2015-07-1')).toBe(false); // day is not zero-padded
    expect(util.validateFrontDate('2015-7-01')).toBe(false); // month is not zero-padded
    expect(util.validateFrontDate('2015-07-01')).toBe(true);
  });

  it('should prettify a flavor model', function() {
    /*
     * Make sure to keep an original copy of data so each assertion is clean.
     * Use a new Flavor() for each set of assertions.
     */
    var data = {
      id: 1,
      name: 'Regular name',
      size: 1,
      company: 1,
      cost: 11.98,
      date_bought: new Date(2015, 6, 1),
      bowls: 10,
      notes: 'Basic information',
      date_completed: new Date(2015, 6, 2),
      finished: 1
    };

    var result = new Flavor(data);
    result = util.prettifyFlavors([result], sizes, companies)[0];
    expect(result.id).toEqual(data.id);
    expect(result.name).toEqual(data.name);
    expect(result.size).toEqual(sizes[0].quantity);
    expect(result.company).toEqual(companies[0].name);
    expect(result.cost).toEqual(data.cost);
    expect(result.date_bought).toEqual('July 1st, 2015');
    expect(result.bowls).toEqual(data.bowls);
    expect(result.notes).toEqual(data.notes);
    expect(result.date_completed).toEqual('July 2nd, 2015');
    expect(result.finished).toEqual(true);

    result = new Flavor(data);
    result.finished = 0;
    result = util.prettifyFlavors([result], sizes, companies)[0];
    expect(result.finished).toEqual(false);

    result = new Flavor(data);
    delete result.date_completed;
    result = util.prettifyFlavors([result], sizes, companies)[0];
    expect(result.date_completed).toEqual('N/A');

    result = new Flavor(data);
    delete result.notes;
    result = util.prettifyFlavors([result], sizes, companies)[0];
    expect(result.notes).toEqual('');
  });

  it('should be able to check for required params', function(){
    var params = {
      'req1': 'val1',
      'req2': 'val2'
    };
    var required = ['req1', 'req2'];
    var errObj = null;

    // make sure both needed are there
    errObj = util.hasRequiredParams(params, required);
    expect(errObj.missingFields.length).toEqual(0);

    // make sure extra non-required params works
    params.nonReq1 = 'val3';
    errObj = util.hasRequiredParams(params, required);
    expect(errObj.missingFields.length).toEqual(0);

    // make sure missing params are reported
    delete params.req1;
    errObj = util.hasRequiredParams(params, required);
    expect(errObj.missingFields).toEqual(['req1']);
    expect(errObj.message).toEqual('Missing required parameter');// make sure message is correct

    // make sure zero required works
    required = [];
    errObj = util.hasRequiredParams(params, required);
    expect(errObj.missingFields.length).toEqual(0);
  });

  it('should be able to simple clone non-cyclic objects', function(){
    expect(util.simpleClone({
      'stringVal': 'val1',
      'intVal': 1,
      'boolVal': true,
      'boolFalse': false,
      'nullVal': null,
      'arrVal': [1,2],
      'emptyArr': [],
      'objVal': {'asdf':'qwer'},
      'emptyObjVal': {}
    })).toEqual({
      'stringVal': 'val1',
      'intVal': 1,
      'boolVal': true,
      'boolFalse': false,
      'nullVal': null,
      'arrVal': [1,2],
      'emptyArr': [],
      'objVal': {'asdf':'qwer'},
      'emptyObjVal': {}
    });
  });
});