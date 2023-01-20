const { fetchAllUsers, fetchUserByUsername } = require("../models/userModels");

exports.getAllUsers = (request, response, next) => {
  return fetchAllUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUserByUsername = (request, response, next) => {
  const username = request.params.username;
  return fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
