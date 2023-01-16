const { fetchAllCategories } = require("../models/categoryModels");

const getAllCategories = (request, response, next) => {
  return fetchAllCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getAllCategories };
