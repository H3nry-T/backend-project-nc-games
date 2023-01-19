const { fetchAllEndpoints } = require("../models/apiModels");

exports.getAllEndpoints = (request, response, next) => {
  return fetchAllEndpoints()
    .then((allEndpoints) => {
      //   console.log(allEndpoints);
      response.status(200).send({ allEndpoints });
    })
    .catch((error) => {
      next(error);
    });
};
