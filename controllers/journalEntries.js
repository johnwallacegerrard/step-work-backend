const Journal = require("../models/journalEntry");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const submitJournalEntry = (req, res, next) => {
  const { entry } = req.body;
  console.log(req.user);

  Journal.findOneAndUpdate(
    { owner: req.user._id },
    { $push: { entries: { entry } } },
    { new: true, upsert: true }
  )
    .then((journal) => res.status(200).send(journal))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
};

const getJournal = (req, res, next) => {
  Journal.findOne({ owner: req.user._id })
    .then((journal) => {
      if (!journal) throw new NotFoundError("No journal found");
      res.status(200).send(journal);
    })
    .catch(next);
};

const deleteJournalEntry = (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  Journal.findOneAndUpdate(
    { owner: req.user._id },
    { $pull: { entries: { _id: id } } },
    { new: true }
  )
    .then((journal) => {
      if (!journal) throw new NotFoundError("No journal found");
      res.status(200).send(journal);
    })
    .catch(next);
};

module.exports = { submitJournalEntry, getJournal, deleteJournalEntry };
