var util = require('../util');

module.exports = function Flavor(data){
  data = data || {};
  this.id = data.id;
  this.name = data.name;
  this.size = data.size;
  this.company = data.company;
  this.cost = data.cost;
  this.date_bought = data.date_bought;
  this.bowls = data.bowls || 0;
  this.notes = data.notes || '';
  this.date_completed = data.date_completed || null;
  this.finished = data.finished || false;

  this.validate = function(idRequired) {
    var errObj = {
      message: 'Invalid model',
      errors: []
    };

    if(idRequired && this.id === undefined) {
      errObj.errors.push('Invalid id');
    }
    if(this.name === undefined || this.name.length === 0) {
      errObj.errors.push('Invalid name');
    }
    if(this.size === undefined || isNaN(parseInt(this.size, 10))) {
      errObj.errors.push('Invalid size');
    }
    if(this.company === undefined || isNaN(parseInt(this.company, 10))) {
      errObj.errors.push('Invalid company');
    }
    if(this.cost === undefined || isNaN(parseFloat(this.cost, 10))) {
      errObj.errors.push('Invalid cost');
    }
    if(this.date_bought === undefined || (typeof this.date_bought === 'string' && !util.validateFrontDate(this.date_bought))) {
      errObj.errors.push('Invalid date_bought');
    }
    // Optionals with defaults
    if(this.bowls === undefined || isNaN(parseFloat(this.bowls, 10))) {
      errObj.errors.push('Invalid bowls');
    }
    if(this.notes === undefined) {
      errObj.errors.push('Invalid notes');
    }
    if(this.date_completed === undefined) {
      errObj.errors.push('Invalid date_completed');
    }
    if(this.finished === undefined) {
      errObj.errors.push('Invalid finished');
    }
    // Special logic
    if(this.finished === true && !this.date_completed) {
      errObj.errors.push('Flavor cannot be finished without a date_completed field');
    }

    return errObj;
  };
};
