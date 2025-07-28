const router = require("express").Router();

const auth = require("../middleware/auth");

const { createUser, getCurrentUser, login } = require("../controllers/users");

router.post("/register", createUser);
router.post("/signin", login);

router.get("/users/me", auth, getCurrentUser);

module.exports = router;
