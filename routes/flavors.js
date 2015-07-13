var express = require('express');
var router = express.Router();

module.exports = function(db) {
  var controller = require('../controllers/flavors')(db);
  router.route('/').get(controller.getFlavors);
  router.route('/').post(controller.addFlavor);
  router.route('/:id/edit').put(controller.editFlavor);
  router.route('/:id/addBowl').post(controller.addBowl);
  router.route('/:id/finish').post(controller.finish);
  return router;
};
