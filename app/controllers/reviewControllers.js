const { fetchReviewById } = require("../models/reviewModels");
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

const getReviewById = (request, response, next) => {
  const review_id = request.params.review_id;
  return fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review: review });
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = { getAllReviews, getReviewById };
