const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const database = require("../../../config/database");
const { ApiError, DatabaseError } = require("../../../helpers/errors");
const { invalidateCache } = require("../../../helpers/middleware/cache");
const addExample = require("../../../database/queries/addExample");

router.post(
  "/",
  invalidateCache,
  celebrate({
    body: Joi.object()
      .keys({
        something: Joi.string().optional(),
        anotherThing: Joi.string().optional()
      })
      .or("something", "anotherThing")
      .required()
  }),
  async (req, res, next) => {
    const { something, anotherThing } = req.body;

    try {
      const newExample = await addExample(database, {
        something,
        anotherThing
      });

      if (!newExample) throw new ApiError();

      res.location(`${req.baseUrl}/${newExample.id}`);
      res.status(201).json(newExample);
    } catch (error) {
      if (error instanceof DatabaseError) {
        next(new ApiError(undefined, undefined, error));
      } else {
        next(error);
      }
    }
  }
);

module.exports = router;
