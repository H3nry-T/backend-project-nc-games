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
  if (isNaN(parseInt(review_id))) {
    return Promise.reject({
      code: 400,
      msg: "bad request, review_id has to be an integer",
    });
  }
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
        return Promise.reject({
          code: 404,
          msg: "not found, review_id doesn't exist in the database",
        });
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
  if (!reqBody.hasOwnProperty("body") || !reqBody.hasOwnProperty("username")) {
    return Promise.reject({
      code: 400,
      msg: "bad request, needs 2 keys body and username",
    });
  }

  return db
    .query("SELECT * FROM users")
    .then((result) => {
      const selectUsers = result.rows;
      const registeredUsernames = selectUsers.map(
        (userObj) => userObj.username
      );
      if (!registeredUsernames.includes(reqBody.username)) {
        return Promise.reject({
          code: 400,
          msg: "bad request, that username is not registered in the database",
        });
      }
      return db.query(insertQuery, insertValues);
    })
    .then((result) => {
      const postedComment = result.rows[0];
      return postedComment;
    });
};

const updateReviewById = (reqBody, review_id) => {
  if (!Object.keys(reqBody).includes("incVotes")) {
    return Promise.reject({
      code: 400,
      msg: "bad request, incVotes key is missing",
    });
  }
  if (typeof reqBody.incVotes === "string") {
    return Promise.reject({
      code: 400,
      msg: "bad request, incVotes must be an integer",
    });
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

module.exports = {
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
  updateReviewById,
};
