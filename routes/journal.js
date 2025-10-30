const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { validateJournalEntry } = require("../middleware/validation");
const {
  submitJournalEntry,
  getJournal,
  deleteJournalEntry,
} = require("../controllers/journalEntries");

router.post("/journal", validateJournalEntry, auth, submitJournalEntry);
router.get("/journal", auth, getJournal);
router.delete("/journal/:id", auth, deleteJournalEntry);
module.exports = router;
