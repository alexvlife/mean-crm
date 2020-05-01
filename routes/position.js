const express = require('express');
const passport = require('passport');
const controller = require('../controllers/position');
const router = express.Router();


// localhost:5000/api/position/:category
router.get('/:categoryid', passport.authenticate('jwt', { session: false }), controller.getByCategoryId);

// localhost:5000/api/position
router.post('/', passport.authenticate('jwt', { session: false }), controller.create);

// localhost:5000/api/position/:id
router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update);

// localhost:5000/api/position/:id
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.remove);


module.exports = router;
