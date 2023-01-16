const db = require("../../db/connection");

const fetchAllCategories = () => {
  return db.query("SELECT slug, description FROM categories").then((result) => {
    if (result.rows) {
      return result.rows;
    } else if (result.rows.length === 0) {
      return Promise.reject({ code: 204, msg: "there is no content" });
    }
  });
};
const fetchAllReviews = () => {
  const selectQuery = `
        SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count 
        FROM reviews 
        JOIN comments 
        ON reviews.review_id = comments.review_id
        GROUP BY reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes
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

module.exports = { fetchAllCategories, fetchAllReviews };
