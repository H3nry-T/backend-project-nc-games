const {
  fetchCommentByCommentId,
  removeCommentById,
  updateCommentById,
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

exports.patchCommentById = (request, response, next) => {
  const reqBody = request.body;
  const comment_id = request.params.comment_id;
  return fetchCommentByCommentId(comment_id)
    .then(() => {
      return updateCommentById(reqBody, comment_id);
    })
    .then((updatedComment) => {
      response.status(200).send({ updatedComment });
    })
    .catch((error) => {
      next(error);
    });
};
