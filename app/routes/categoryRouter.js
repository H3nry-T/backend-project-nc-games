const { getAllCategories } = require("../controllers/categoryControllers");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getAllCategories);

module.exports = categoryRouter;
