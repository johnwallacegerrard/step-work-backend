const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { submitJournalEntry } = require("../controllers/journalEntries");

router.post("/journal", auth, submitJournalEntry);

module.exports = router;
