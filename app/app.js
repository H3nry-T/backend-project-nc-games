const express = require("express");
const { getAllCategories } = require("./controllers/categoryControllers");
const {
  getAllReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
  postCommentByReviewId,
} = require("./controllers/reviewControllers");
const { getAllUsers } = require("../app/controllers/userControllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getAllUsers);

// 204 no content error
app.use((error, request, response, next) => {
  if (error.code === 204) {
    // console.log(error);
    response.status(204).send({ error: error });
  } else {
    next(error);
  }
});

//route found MANUAL 404 Not found error
app.use((error, request, response, next) => {
  if (error.code === 404) {
    // console.log(error);
    response.status(404).send({ error: error });
  } else {
    next(error);
  }
});

//SQL POST/PATCH 400 bad request error
app.use((error, request, response, next) => {
  if (
    (error.code =
      400 ||
      error.code === "22P02" ||
      error.code === "23503" ||
      error.code === "23502")
  ) {
    // console.log(error);
    if (error.hasOwnProperty("msg")) {
      response.status(400).send({ error: error });
    } else {
      response.status(400).send({ error: { code: 400, msg: "Bad request" } });
    }
  } else {
    next(error);
  }
});

//route not found 404 error
app.use((request, response, next) => {
  response.status(404).send({ code: 404, msg: "not found" });
});

//500 internal server error
app.use((error, request, response, next) => {
  if (error) {
    console.log(error); //debug console.log
    response.status(500).send({ error: error });
  }
});
module.exports = app;
