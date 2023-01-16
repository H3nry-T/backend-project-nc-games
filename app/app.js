const express = require("express");
const { getAllCategories } = require("./controllers/categoryControllers");
const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
} = require("./controllers/reviewControllers");
const app = express();

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

//GET:/api/"something" 204 no content error
app.use((error, request, response, next) => {
  if (error.code === 204) {
    // console.log(error);
    response.status(204).send({ error: error });
  } else {
    next(error);
  }
});

//GET:/api/something/:something_id 400 bad request error
app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    // console.log(error);
    response.status(400).send({ error: error });
  } else {
    next(error);
  }
});

//GET:/api/something/:something_id 404 Not found error
app.use((error, request, response, next) => {
  if (error.code === 404) {
    // console.log(error);
    response.status(404).send({ error: error });
  } else {
    next(error);
  }
});

//GET:/api/"something" 500 internal server error
app.use((error, request, response, next) => {
  if (error) {
    // console.log(error); //debug console.log
    response.status(500).send({ error: error });
  }
});
module.exports = app;
