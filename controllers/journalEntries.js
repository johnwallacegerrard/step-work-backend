const User = require("../models/User");

const BadRequestError = require("../errors/BadRequestError");

const UnauthorizedError = require("../errors/UnauthorizedError");

const NotFoundError = require("../errors/NotFoundError");

const submitJournalEntry = (req, res, next) => {
  const { _id } = req.user;
  const { entry } = req.body;

  User.findByIdAndUpdate(
    _id,
    {
      $push: {
        journal: {
          entry,
        },
      },
    },
    { new: true }
  )
    .then((data) => res.status(200).send(data))
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

getJournalEntries = (req, res, next) => {};

module.exports = { submitJournalEntry };
