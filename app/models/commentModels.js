const db = require("../../db/connection");

exports.removeCommentById = (comment_id) => {
  const deleteQuery = `
      DELETE FROM comments 
      WHERE comment_id = $1
    `;

  return db.query(deleteQuery, [comment_id]);
};

exports.fetchCommentByCommentId = (comment_id) => {
  const selectQuery = `
      SELECT * FROM comments
      WHERE comment_id = $1
    `;
  return db.query(selectQuery, [comment_id]).then((result) => {
    const comment = result.rows[0];
    if (!comment) {
      return Promise.reject({
        code: 404,
        msg: "bad request, invalid comment_id",
      });
    }
    return comment;
  });
};

exports.updateCommentById = async (reqBody, comment_id) => {
  if (typeof reqBody.inc_votes === "string") {
    return Promise.reject({
      code: 400,
      msg: "bad request, inc_votes must be an integer",
    });
  }
  if (!Object.keys(reqBody).includes("inc_votes")) {
    return Promise.reject({
      code: 400,
      msg: "bad request, request body must have the key inc_votes",
    });
  }
  const updateQuery = `
    UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
  `;
  const result = await db.query(updateQuery, [reqBody.inc_votes, comment_id]);
  const updatedComment = result.rows[0];
  return updatedComment;
};
