const db = require("../../db/connection");
const endpointsJSON = require("../../endpoints.json");
const fs = require("fs/promises");
exports.fetchAllEndpoints = () => {
  return fs
    .readFile(__dirname + `/../../endpoints.json`, "utf-8")
    .then((response) => {
      return JSON.parse(response);
    });
};
