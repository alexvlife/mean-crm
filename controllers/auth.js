const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys')


module.exports.login = async function(req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    // check password
    const entryPassword = req.body.password;
    const passwordWithHash = candidate.password;
    const passwordResult = bcrypt.compareSync(entryPassword, passwordWithHash);

    if (passwordResult) {
      // generating a token
      const SECONDS_IN_HOUR = 60 * 60;
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, { expiresIn: SECONDS_IN_HOUR });

      res.status(200).json({
        token: `Bearer ${token}`
      });
    } else {
      // send error
      res.status(401).json({
        message: 'Wrong password.'
      });
    }

  } else {
    // send error
    res.status(404).json({
      message: 'User with such email address was not found.',
    });
  }
}


module.exports.register = async function(req, res) {
  // check user
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    // send error
    res.status(409).json({
      message: 'Such email already exist. Try entering a different email.'
    });
  } else {
    // create new user
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch {
      // TODO: handle error
    }
  }
}
