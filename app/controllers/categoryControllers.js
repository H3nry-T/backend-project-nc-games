const { getCategoriesModel } = require("../models/categoryModels");

const getCategoriesController = (request, response, next) => {
  return getCategoriesModel()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getCategoriesController };
