var express = require('express');
var router = express.Router();

module.exports = function(db) {
  var controller = require('../controllers/companies')(db);
  router.route('/').get(controller.getCompanies);
  return router;
};
