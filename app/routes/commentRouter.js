const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/commentControllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);
commentRouter.patch("/:comment_id", patchCommentById);

module.exports = commentRouter;
