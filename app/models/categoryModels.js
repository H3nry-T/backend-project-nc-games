const db = require("../../db/connection");

const fetchAllCategories = () => {
  return db.query("SELECT slug, description FROM categories").then((result) => {
    if (result.rows) {
      return result.rows;
    } else if (result.rows.length === 0) {
      return Promise.reject({ code: 204, msg: "there is no content" });
    }
  });
};

module.exports = { fetchAllCategories };
