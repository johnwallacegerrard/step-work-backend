const User = require("../models/User");

const BadRequestError = require("../errors/BadRequestError");

const NotFoundError = require("../errors/NotFoundError");

const submitStepAnswers = (req, res, next) => {
  const { _id } = req.user;
  const stepNumber = parseInt(req.params.stepNumber);
  const answers = req.body;

  User.findById(_id)
    .then((user) => {
      const existingStep = user.stepProgress.find(
        (step) => step.stepNumber === stepNumber
      );

      if (existingStep) {
        return User.updateOne(
          { _id, "stepProgress.stepNumber": stepNumber },
          {
            $set: {
              "stepProgress.$.answers": answers,
            },
          },
          { new: true }
        )
          .orFail()
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              return next(new BadRequestError("Invalid data"));
            }
            if (
              err.name === "CastError" ||
              err.name === "DocumentNotFoundError"
            ) {
              return next(new NotFoundError("Not found"));
            }
            return next(err);
          });
      } else {
        User.findByIdAndUpdate(_id, {
          $push: {
            stepProgress: {
              stepNumber,
              answers: answers,
              completed: true,
            },
          },
          currentStep: user.currentStep + 1,
        })
          .orFail()
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              return next(new BadRequestError("Invalid data"));
            }
            if (
              err.name === "CastError" ||
              err.name === "DocumentNotFoundError"
            ) {
              return next(new NotFoundError("Not found"));
            }
            return next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "CastError" || err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Not found"));
      }
      return next(err);
    });
};

module.exports = { submitStepAnswers };
