const { Joi, celebrate } = require("celebrate");

module.exports.validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().min(2).max(24).required(),
    lastInitial: Joi.string().min(1).max(1).required(),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validateJournalEntry = celebrate({
  body: Joi.object().keys({
    entry: Joi.string().required(),
  }),
});

module.exports.validateStepSubmission = celebrate({
  body: Joi.object().keys({
    answers: Joi.array().items(Joi.string().required()),
  }),
});
