const express = require("express");
const cors = require("cors");
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
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

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
