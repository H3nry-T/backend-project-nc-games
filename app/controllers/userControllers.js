const { fetchAllUsers } = require("../models/userModels");

exports.getAllUsers = (request, response, next) => {
  return fetchAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};
