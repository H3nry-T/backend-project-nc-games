const {
  fetchAllCategories,
  fetchAllReviews,
} = require("../models/categoryModels");

const getAllCategories = (request, response, next) => {
  return fetchAllCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch((error) => {
      next(error);
    });
};
const getAllReviews = (request, response, next) => {
  return fetchAllReviews()
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = { getAllCategories, getAllReviews };
