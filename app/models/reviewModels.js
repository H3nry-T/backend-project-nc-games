const db = require("../../db/connection");

const fetchAllReviews = (query) => {
  return db.query("SELECT slug FROM categories").then((result) => {
    //get all the valid category slugs (needed for error handling category query)
    let selectQuery = `
          SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count 
          FROM reviews 
          LEFT JOIN comments 
          ON reviews.review_id = comments.review_id
          `; //DEFAULT
    let queryValues = [];
    if (query.category) {
      const categorySlugs = result.rows.map((categoryObj) => categoryObj.slug);
      if (categorySlugs.includes(query.category)) {
        queryValues.push(query.category);
        selectQuery += "WHERE category = $1 ";
      } else {
        return Promise.reject({ code: 400, msg: "invalid category query" });
      }
    }
    selectQuery += `GROUP BY reviews.review_id `; //DEFAULT
    if (query.sort_by) {
      if (
        [
          "title",
          "category",
          "review_img_url",
          "designer",
          "comment_count",
        ].includes(query.sort_by)
      ) {
        selectQuery += `ORDER BY ${query.sort_by} `;
      } else if (
        ["owner", "review_id", "created_at", "votes"].includes(query.sort_by)
      ) {
        selectQuery += `ORDER BY reviews.${query.sort_by}`;
      } else {
        return Promise.reject({ code: 400, msg: "invalid sort_by query" });
      }
    } else {
      selectQuery += "ORDER BY reviews.created_at"; //DEFAULT
    }
    if (query.order) {
      if (query.order === "DESC") {
        selectQuery += " DESC";
      } else if (query.order === "ASC") {
        selectQuery += " ASC";
      } else {
        return Promise.reject({ code: 400, msg: "invalid order query" });
      }
    } //ASC is default if there is no query.order

    return db.query(selectQuery, queryValues).then((result) => {
      const allReviews = result.rows;
      return allReviews;
    });
  });
};

const fetchReviewById = (review_id) => {
  const selectValues = [review_id];
  return db
    .query(
      `
      SELECT reviews.owner, title, reviews.review_id, category, review_body, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
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

const insertCommentByReviewId = (reqBody, review_id) => {
  const insertQuery = `
  INSERT INTO comments 
    (body, review_id, author)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `;
  const insertValues = [reqBody.body, review_id, reqBody.username];
  return db.query(insertQuery, insertValues).then((result) => {
    const postedComment = result.rows[0];
    return postedComment;
  });
};

const updateReviewById = (reqBody, review_id) => {
  if (!Object.keys(reqBody).includes("incVotes")) {
    return Promise.reject({ code: 400, msg: "missing an incVotes key" });
  }

  const updateQuery = `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *
  `;
  const updateValues = [reqBody.incVotes, Number(review_id)];

  return db.query(updateQuery, updateValues).then((result) => {
    const updatedReview = result.rows[0];
    return updatedReview;
  });
};

const removeCommentById = (comment_id) => {
  const deleteQuery = `
    DELETE FROM comments 
    WHERE comment_id = $1
  `;

  return db.query(deleteQuery, [comment_id]);
};

const fetchCommentByCommentId = (comment_id) => {
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
module.exports = {
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateReviewById,
  removeCommentById,
  fetchCommentByCommentId,
};
