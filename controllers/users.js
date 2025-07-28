const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const user = require("../models/User");

const BadRequestError = require("../errors/BadRequestError");

const UnauthorizedError = require("../errors/UnauthorizedError");

const NotFoundError = require("../errors/NotFoundError");

const ConflictError = require("../errors/ConflictError");

const JWT_SECRET = require("../utils/config");

const createUser = (req, res, next) => {
  console.log("req.body:", req.body);
  const { firstName, lastInitial, email, password } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      user.create({
        firstName,
        lastInitial,
        email: req.body.email,
        password: hash,
      })
    )

    .then((data) => {
      const userData = data.toObject();
      delete userData.password;
      res.status(201).send(userData);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("A user with that email already exists"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  user
    .findById(_id)
    .orFail()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Not found"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Username and password are required"));
  }

  return user
    .findUserByCredentials(email, password)
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login };
