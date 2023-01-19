const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewById,
} = require("../controllers/reviewControllers");

const reviewRouter = require("express").Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:review_id", getReviewById);
reviewRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewRouter.post("/:review_id/comments", postCommentByReviewId);
reviewRouter.patch("/:review_id", patchReviewById);

module.exports = reviewRouter;
