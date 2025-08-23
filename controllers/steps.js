const stepProgress = require("../models/steps");

const BadRequestError = require("../errors/BadRequestError");

const NotFoundError = require("../errors/NotFoundError");

const submitStepAnswers = (req, res, next) => {
  const stepNumber = parseInt(req.params.stepNumber);
  const answers = req.body;

  stepProgress
    .findOne({ owner: req.user._id })
    .then((steps) => {
      const existingStep = steps.stepProgress.find(
        (step) => step.stepNumber === stepNumber
      );

      if (existingStep) {
        return stepProgress
          .findOneAndUpdate(
            { owner: req.user._id, "stepProgress.stepNumber": stepNumber },
            {
              $set: {
                "stepProgress.$.answers": answers,
              },
            },
            { new: true }
          )
          .orFail();
      } else {
        return stepProgress
          .findOneAndUpdate(
            { owner: req.user._id },
            {
              $push: {
                stepProgress: {
                  stepNumber,
                  answers: answers,
                  completed: true,
                },
              },
            }
          )
          .orFail();
      }
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Not found"));
      }
      return next(err);
    });
};

module.exports = { submitStepAnswers };
