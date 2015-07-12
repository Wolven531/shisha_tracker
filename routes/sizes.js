var express = require('express');
var router = express.Router();
var controller = require('../controllers/sizes');

module.exports = function() {
  router.route('/').get(controller.getSizes);
  return router;
};
