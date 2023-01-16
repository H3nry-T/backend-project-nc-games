const db = require("../../db/connection");

const getCategoriesModel = () => {
  return db.query("SELECT slug, description FROM categories").then((result) => {
    if (result.rows) {
      return result.rows;
    } else {
      return Promise.reject({ code: 204, msg: "there is no content" });
    }
  });
};

module.exports = { getCategoriesModel };
