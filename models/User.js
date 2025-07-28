const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const StepProgressSchema = new mongoose.Schema({
  stepNumber: Number,
  answers: [String],
  completed: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastInitial: {
      type: String,
      required: true,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    stepProgress: [StepProgressSchema],
  },
  { timestamps: true }
);

UserSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", UserSchema);
