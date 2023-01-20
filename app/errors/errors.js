//404
exports.handleManualNotFoundErrors = (error, request, response, next) => {
  if (error.code === 404) {
    // console.log(error);
    response.status(404).send({ error: error });
  } else {
    next(error);
  }
};

//400
exports.handleBadRequestErrors = (error, request, response, next) => {
  if (
    (error.code =
      400 ||
      error.code === "22P02" ||
      error.code === "23503" ||
      error.code === "23502")
  ) {
    console.log(error);
    response.status(400).send({ error: error });
  } else {
    next(error);
  }
};

//custom errors
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code && err.msg) {
    res.status(err.status).send({ error: error });
  } else next(err);
};

//404
exports.handleNotFoundErrors = (request, response, next) => {
  response.status(404).send({ code: 404, msg: "not found" });
};

//500
exports.handleInternalServerErrors = (error, request, response, next) => {
  if (error) {
    // console.log(error);
    response.status(500).send({ error: error });
  }
};
