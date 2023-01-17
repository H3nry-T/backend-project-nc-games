const db = require("../../db/connection");

const fetchAllReviews = () => {
  const selectQuery = `
        SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count 
        FROM reviews 
        LEFT JOIN comments 
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at;
    `;
  return db.query(selectQuery).then((result) => {
    if (result.rows) {
      return result.rows;
    } else if (result.rows.length === 0) {
      return Promise.reject({ code: 204, msg: "there is no content" });
    }
  });
};

const fetchReviewById = (review_id) => {
  const selectValues = [review_id];

  return db
    .query(
      `
    SELECT *
    FROM reviews
    WHERE reviews.review_id = $1
  `,
      selectValues
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({ code: 404, msg: "Not found" });
      } else {
        return review;
      }
    });
};

const fetchCommentsByReviewId = (review_id) => {
  const selectValues = [review_id];
  //all review_id coming in are 100% valid no need to check
  //if review_id exists in db

  return db
    .query(
      `
      SELECT comment_id, comments.votes, comments.created_at, author, body, comments.review_id
      FROM reviews
      JOIN comments 
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      ORDER BY comments.created_at DESC;
  `,
      selectValues
    )
    .then((result) => {
      const comments = result.rows;
      return comments;
    });
};

const updateReviewById = (reqBody, review_id) => {
  if (!Object.keys(reqBody).includes("incVotes")) {
    return Promise.reject({ code: 400, msg: "Bad request" });
  }
  const updateQuery = `
    UPDATE reviews
      SET votes += $1
    WHERE review_id = $2
    RETURNING *
  `;
  const updateValues = [reqBody.incVotes, review_id];

  return db.query(updateQuery, updateValues).then((result) => result.rows[0]);
};
module.exports = {
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  updateReviewById,
};
