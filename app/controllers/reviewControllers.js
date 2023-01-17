const {
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,

  updateReviewById,
} = require("../models/reviewModels");

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

const getCommentsByReviewId = (request, response, next) => {
  const review_id = request.params.review_id;
  return fetchReviewById(review_id) //checks: does the review even exist?
    .then(() => {
      return fetchCommentsByReviewId(review_id); //if review exists: find the comment
    })
    .then((comments) => {
      response.status(200).send({ comments: comments });
    })
    .catch((error) => {
      next(error);
    });
};

const postCommentByReviewId = (request, response, next) => {
  const reqBody = request.body;
  const review_id = request.params.review_id;
  return insertCommentByReviewId(reqBody, review_id)
    .then((postedComment) => {
      response.status(201).send({ postedComment });
    })
    .catch((error) => {
      next(error);
    });
};

const patchReviewById = (request, response, next) => {
  const reqBody = request.body;
  const review_id = request.params.review_id;
  return updateReviewById(reqBody, review_id)
    .then((patchedReview) => {
      response.status(200).send({ patchedReview });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewById,
};
