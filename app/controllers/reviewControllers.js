const { fetchAllReviews } = require("../models/reviewModels");

const getAllReviews = (request, response, next) => {
  return fetchAllReviews()
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = { getAllReviews };
