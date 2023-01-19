exports.getAllEndpoints = (request, response, next) => {
  response.status(200).send({ allEndpoints: [{ endoint1: "hello there" }] });
};
