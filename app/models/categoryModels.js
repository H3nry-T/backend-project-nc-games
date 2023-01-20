const db = require("../../db/connection");

const fetchAllCategories = () => {
  return db
    .query("SELECT slug, description FROM categories")
    .then((result) => result.rows);
};

module.exports = { fetchAllCategories };
