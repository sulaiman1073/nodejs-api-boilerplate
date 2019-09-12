const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const database = require("../../../config/database");
const { ApiError, DatabaseError } = require("../../../helpers/errors");
const { invalidateCache } = require("../../../helpers/middleware/cache");
const updateExample = require("../../../database/queries/updateExample");

router.put(
  "/:id",
  invalidateCache,
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.number()
          .integer()
          .min(1)
          .required()
      })
      .required(),
    body: Joi.object()
      .keys({
        something: Joi.string()
          .min(3)
          .max(100),
        anotherThing: Joi.string()
          .min(3)
          .max(100)
      })
      .or("something", "anotherThing")
      .required()
  }),
  async (req, res, next) => {
    const { id } = req.params;
    const { something, anotherThing } = req.body;

    try {
      const updatedExample = await updateExample(database, {
        id,
        something,
        anotherThing
      });

      if (!updatedExample)
        throw new ApiError(`Example with id of ${id} not found`, 404);

      res.status(200).json(updatedExample);
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
