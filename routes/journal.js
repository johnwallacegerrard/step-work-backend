const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  submitJournalEntry,
  getJournal,
  deleteJournalEntry,
} = require("../controllers/journalEntries");

router.post("/journal", auth, submitJournalEntry);
router.get("/journal", auth, getJournal);
router.delete("/journal", auth, deleteJournalEntry);
module.exports = router;
