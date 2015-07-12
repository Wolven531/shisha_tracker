var express = require('express');
var router = express.Router();
var controller = require('../controllers/companies');

module.exports = function() {
  router.route('/').get(controller.getCompanies);
  return router;
};
