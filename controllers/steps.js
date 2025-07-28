const User = require("../models/User");

const BadRequestError = require("../errors/BadRequestError");

const UnauthorizedError = require("../errors/UnauthorizedError");

const NotFoundError = require("../errors/NotFoundError");

const submitStepAnswers = (req, res, next) => {
  const { _id } = req.user;
  const stepNumber = parseInt(req.params.stepNumber);
  const { answers } = req.body;

  User.findById(_id)
    .orFail()
    .then((user) => {
      const existingStep = user.stepProgress.find(
        (step) => step.stepNumber === stepNumber
      );

      if (user.stepProgress.length === 0 && stepNumber === 1) {
        return User.findByIdAndUpdate(
          _id,
          {
            stepProgress: [
              {
                stepNumber,
                answers,
                completed: true,
              },
            ],
            currentStep: currentStep + 1,
          },
          { new: true }
        ).then((data) => res.status(200).send(data));
      }

      if (existingStep) {
        return User.updateOne(
          { _id, "stepProgress.stepNumber": stepNumber },
          {
            $set: {
              "stepProgress.$.answers": answers,
              "stepProgress.$.completed": true,
            },
          }
        ).then(() => res.status(200).send({ message: "Step updated." }));
      } else {
        return User.findByIdAndUpdate(
          _id,
          {
            $push: {
              stepProgress: {
                stepNumber,
                answers,
                completed: true,
              },
            },
            currentStep: currentStep + 1,
          },
          { new: true }
        ).then((data) => res.status(200).send(data));
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
