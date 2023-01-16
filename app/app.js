const express = require("express");
const { getAllCategories } = require("./controllers/categoryControllers");

const app = express();

app.get("/api/categories", getAllCategories);

//GET:/api/categories 204 no content error
app.use((error, request, response, next) => {
  if (error.code === 204) {
    console.log(error);
    response.status(204).send({ error: error });
  } else {
    next(error);
  }
});

//GET:/api/categories 500 internal server error
app.use((error, request, response, next) => {
  if (error) {
    // console.log(error); //debug console.log
    response.status(500).send({ error: error });
  } else {
    next(error);
  }
});
module.exports = app;
