const { deleteCommentById } = require("../controllers/reviewControllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
