const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const database = require("../../../config/database");
const { ApiError, DatabaseError } = require("../../../helpers/errors");
const { invalidateCache } = require("../../../helpers/middleware/cache");
const deleteExample = require("../../../database/queries/deleteExample");

router.delete(
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
      .required()
  }),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const didDelete = await deleteExample(database, { id });

      if (!didDelete)
        throw new ApiError(`Example with id of ${id} not found`, 404);

      res.status(204).json({});
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
