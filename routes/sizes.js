var express = require('express');
var router = express.Router();

module.exports = function(db) {
  var controller = require('../controllers/sizes')(db);
  router.route('/').get(controller.getSizes);
  return router;
};
