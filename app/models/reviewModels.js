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
  console.log(review_id, typeof review_id);
  const selectValues = [review_id];

  return db
    .query(
      `
    SELECT 
      review_id,
      title,
      review_body,
      designer,
      review_img_url,
      votes,
      category,
      owner,
      created_at
    FROM reviews
    WHERE reviews.review_id = $1
  `,
      selectValues
    )
    .then((result) => {
      console.log(result.rows[0]);
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({ code: 404, msg: "Not found" });
      } else {
        return review;
      }
    });
};
module.exports = { fetchAllReviews, fetchReviewById };
