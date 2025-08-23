const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  validateRegistration,
  validateSignIn,
} = require("../middleware/validation");

const { createUser, getCurrentUser, login } = require("../controllers/users");

router.post("/register", validateRegistration, createUser);
router.post("/signin", validateSignIn, login);

router.get("/users/me", auth, getCurrentUser);

module.exports = router;
