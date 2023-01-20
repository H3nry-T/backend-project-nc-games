const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/userControllers");

const userRouter = require("express").Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:username", getUserByUsername);
module.exports = userRouter;
