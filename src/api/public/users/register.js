const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { celebrate, Joi } = require("celebrate");
const pgErrorCodes = require("pg-error-codes");
const database = require("../../../config/database");
const { sendRegistrationEmail } = require("../../../jobs/publishers");
const addUser = require("../../../database/queries/addUser");
const config = require("../../../config");
const { ApiError, DatabaseError } = require("../../../helpers/errors");

router.post(
  "/",
  celebrate({
    body: Joi.object()
      .keys({
        firstName: Joi.string()
          .min(3)
          .max(30)
          .required(),
        lastName: Joi.string()
          .min(3)
          .max(30)
          .required(),
        username: Joi.string()
          .min(3)
          .max(30)
          .required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .min(6)
          .regex(/[a-z]/)
          .regex(/[A-Z]/)
          .regex(/\d+/)
          .required(),
        dateOfBirth: Joi.date()
          .iso()
          // fix min and max below to be more dynamic
          .min("1920-01-01")
          .max("2010-01-01")
          .required()
      })
      .required()
  }),
  async (req, res, next) => {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      dateOfBirth
    } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await addUser(database, {
        firstName,
        lastName,
        username,
        email,
        hashedPassword,
        dateOfBirth
      });

      if (!newUser) throw new ApiError();

      if (!config.benchmark) {
        await sendRegistrationEmail({ email });
      }

      res.location(`${req.baseUrl}/${newUser.id}`);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (pgErrorCodes[error.code] === "unique_violation") {
          if (error.constraint === "unique_email") {
            next(new ApiError("Email already in use", 409, error));
          } else if (error.constraint === "unique_username") {
            next(new ApiError("Username already in use", 409, error));
          }
        } else {
          next(new ApiError(undefined, undefined, error));
        }
      } else {
        next(error);
      }
    }
  }
);

module.exports = router;
