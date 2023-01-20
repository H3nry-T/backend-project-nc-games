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
      return Promise.reject({ code: 404, msg: "Invalid comment_id" });
    }
    return comment;
  });
};
