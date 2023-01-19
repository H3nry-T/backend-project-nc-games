const express = require("express");
const apiRouter = require("./routes/apiRouter");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

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
      //SQL custom errors
      response.status(400).send({ error: error });
    } else if (error.routine === "ExecConstraints") {
      //SQL cannot insert null values
      response.status(400).send({
        error: {
          code: 400,
          msg: "Bad request must have username, body keys",
        },
      });
    } else if (error.routine === "ri_ReportViolation") {
      //SQL violates foreign key
      response.status(400).send({
        error: {
          code: 400,
          msg: "Bad request the username is not registered with us",
        },
      });
    } else {
      //SQL any other error
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
    // console.log(error);
    response.status(500).send({ error: error });
  }
});
module.exports = app;
