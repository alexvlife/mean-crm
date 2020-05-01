const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');


module.exports.getAll = async function(req, res) {
  try {
    // Search categories that created by current user
    // user data comes from /middleware/passport, see - done(null, user)
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
  } catch (e) {
    errorHandler(res, e);
  }
}

module.exports.getById = async function(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (e) {
    errorHandler(res, e);
  }
}

module.exports.remove = async function(req, res) {
  try {
    const categoryId = req.params.id;
    await Category.remove({ _id: categoryId });

    // Because each category has a positions,
    // after deleted some Category, we must delete the Positions that belong to this Category
    await Position.remove({ category: categoryId });

    res.status(200).json({
      message: `Category ${categoryId} and belonging Positions was successfully deleted.`
    });
  } catch (e) {
    errorHandler(res, e);
  }
}

module.exports.create = function(req, res) {
  try {

  } catch (e) {
    errorHandler(res, e);
  }
}

module.exports.update = function(req, res) {
  try {

  } catch (e) {
    errorHandler(res, e);
  }
}
