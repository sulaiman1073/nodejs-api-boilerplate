const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const bcrypt = require("bcryptjs");
const database = require("../../../config/database");
const authenticateUser = require("../../../helpers/middleware/authenticateUser");
const { ApiError, DatabaseError } = require("../../../helpers/errors");
const upload = require("../../../helpers/middleware/multer");
const getUser = require("../../../database/queries/getUser");
const updateUser = require("../../../database/queries/updateUser");

router.put(
  "/:id",
  authenticateUser,
  upload.single("avatar"),
  (req, res, next) => {
    if (req.file) {
      // append filename to path
      req.body.avatar = req.file.filename;
    }
    next();
  },
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string()
          .uuid()
          .required()
      })
      .required(),
    body: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .optional(),
        password: Joi.string()
          .min(6)
          .optional(),
        newPassword: Joi.string()
          .min(6)
          .optional(),
        avatar: Joi.string().optional()
      })
      .xor("email", "newPassword", "avatar")
      .with("email", "password")
      .with("newPassword", "password")
      .without("avatar", "newPassword")
      .required()
  }),
  async (req, res, next) => {
    const { id } = req.params;
    const { email, password, newPassword, avatar } = req.body;
    let hashedPassword;
    try {
      if (newPassword || email) {
        const user = await getUser(database, { id, withPassword: true });

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect)
          throw new ApiError(`The password is incorrect`, 401);
      }
      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const newUser = await updateUser(database, {
        id,
        email,
        hashedPassword,
        avatar
      });

      if (!newUser)
        throw new ApiError(`Example with id of ${id} not found`, 404);

      res.status(200).json(newUser);
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
