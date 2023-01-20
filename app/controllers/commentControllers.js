const {
  fetchCommentByCommentId,
  removeCommentById,
} = require("../models/commentModels");

exports.deleteCommentById = (request, response, next) => {
  const comment_id = request.params.comment_id;
  return fetchCommentByCommentId(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};
