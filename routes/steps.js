const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { validateStepSubmission } = require("../middleware/validation");
const { submitStepAnswers } = require("../controllers/steps");

router.post(
  "/steps/:stepNumber",
  validateStepSubmission,
  auth,
  submitStepAnswers
);

module.exports = router;
