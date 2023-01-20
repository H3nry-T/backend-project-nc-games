const { deleteCommentById } = require("../controllers/commentControllers");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
