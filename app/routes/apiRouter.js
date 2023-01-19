const { getAllEndpoints } = require("../controllers/apiControllers");

//all routes
const apiRouter = require("express").Router();
const categoryRouter = require("./categoryRouter");
const reviewRouter = require("./reviewRouter");
const userRouter = require("./userRouter");
const commentRouter = require("./commentRouter");

apiRouter.get("/", getAllEndpoints);

apiRouter.use("/categories", categoryRouter);

apiRouter.use("/reviews", reviewRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
