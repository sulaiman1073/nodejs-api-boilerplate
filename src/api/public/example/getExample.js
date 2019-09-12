const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const database = require("../../../config/database");
const { ApiError, DatabaseError } = require("../../../helpers/errors");
const { cache } = require("../../../helpers/middleware/cache");
const getExample = require("../../../database/queries/getExample");

router.get(
  "/:id",
  cache,
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.number()
          .integer()
          .min(1)
          .required()
      })
      .required()
  }),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const example = await getExample(database, { id });

      if (!example)
        throw new ApiError(`Example with id of ${id} not found`, 404);

      res.json(example);
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
