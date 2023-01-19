const { getAllEndpoints } = require("../controllers/apiControllers");
const { getAllCategories } = require("../controllers/categoryControllers");
const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewById,
  deleteCommentById,
} = require("../controllers/reviewControllers");
const { getAllUsers } = require("../controllers/userControllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getAllEndpoints);
apiRouter.get("/categories", getAllCategories);
apiRouter.get("/reviews", getAllReviews);
apiRouter.get("/reviews/:review_id", getReviewById);
apiRouter.get("/reviews/:review_id/comments", getCommentsByReviewId);
apiRouter.post("/reviews/:review_id/comments", postCommentByReviewId);
apiRouter.patch("/reviews/:review_id", patchReviewById);
apiRouter.get("/users", getAllUsers);
apiRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = apiRouter;
