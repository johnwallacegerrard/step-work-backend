const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  entry: { type: String, required: true },
});

const JournalSchema = new mongoose.Schema({
  entries: { type: [JournalEntrySchema], default: [] },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("journal", JournalSchema);
