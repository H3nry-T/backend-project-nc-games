const db = require("../../db/connection");

exports.fetchAllUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

exports.fetchUserByUsername = async (username) => {
  const registeredUsers = await db.query(`SELECT * FROM users`);
  const allowedUsernames = registeredUsers.rows.map(
    (userObj) => userObj.username
  );
  if (!allowedUsernames.includes(username)) {
    return Promise.reject({
      code: 404,
      msg: "not found, maybe that username doesn't exist?",
    });
  }
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const user = result.rows[0];
  return user;
};
