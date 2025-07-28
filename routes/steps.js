const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { submitStepAnswers } = require("../controllers/steps");

router.post("/steps/:stepNumber", auth, submitStepAnswers);

module.exports = router;
