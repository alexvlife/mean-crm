const express = require('express');
const controller = require('../controllers/position');
const router = express.Router();


// localhost:5000/api/position/:category
router.get('/:categoryid', controller.getByCategoryId);

// localhost:5000/api/position
router.post('/', controller.create);

// localhost:5000/api/position/:id
router.patch('/:id', controller.update);

// localhost:5000/api/position/:id
router.delete('/:id', controller.remove);


module.exports = router;
