const { getAllUsers } = require("../controllers/userControllers");

const userRouter = require("express").Router();

userRouter.get("/", getAllUsers);

module.exports = userRouter;
