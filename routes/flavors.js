var express = require('express');
var router = express.Router();
var controller = require('../controllers/flavors');

module.exports = function() {
  router.route('/').get(controller.getFlavors);
  router.route('/').post(controller.addFlavor);
  router.route('/:id/edit').put(controller.editFlavor);
  router.route('/:id/addBowl').post(controller.addBowl);
  router.route('/:id/finish').post(controller.finish);
  return router;
};
