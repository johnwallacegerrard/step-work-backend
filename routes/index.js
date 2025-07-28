const router = require("express").Router();

const NotFoundError = require("../errors/NotFoundError");

const userRouter = require("./users");

const stepsRouter = require("./steps");

router.use("/", userRouter);
router.use("/", stepsRouter);
router.use((req, res, next) => next(new NotFoundError("Not found")));

module.exports = router;
