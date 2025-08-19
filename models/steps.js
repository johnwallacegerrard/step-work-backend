const mongoose = require("mongoose");

const StandardStepSchema = new mongoose.Schema({
  stepNumber: Number,
  answers: [String],
  completed: { type: Boolean, default: false },
});

const StepProgressSchema = new mongoose.Schema({
  stepProgress: { type: [StandardStepSchema], default: [] },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("stepProgress", StepProgressSchema);
