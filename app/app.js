const express = require("express");
const {
  handleManualNotFoundErrors,
  handleBadRequestErrors,
  handleNotFoundErrors,
  handleInternalServerErrors,
  handleNoContentErrors,
  handleCustomErrors,
} = require("./errors/errors");
const apiRouter = require("./routes/apiRouter");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

// 204
app.use(handleNoContentErrors);

//404 MANUAL
app.use(handleManualNotFoundErrors);

//400
app.use(handleBadRequestErrors);

//CUSTOM ERRORS
app.use(handleCustomErrors);

//404 DEFAULT
app.use(handleNotFoundErrors);

//500
app.use(handleInternalServerErrors);
module.exports = app;
