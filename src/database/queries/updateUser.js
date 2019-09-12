const knex = require("../../config/knex");
const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (
  db,
  { id, email, hashedPassword: password, avatar }
) => {
  try {
    const query = knex
      .update({
        email,
        password,
        avatar,
        updated_at: knex.raw("NOW()")
      })
      .from("users")
      .where("id", id)
      .andWhere("deleted", false)
      .returning([
        "id",
        "first_name AS firstName",
        "last_name AS lastName",
        "username",
        "email",
        "date_of_birth AS dateOfBirth",
        "avatar AS avatar",
        "email_verified AS emailVerified",
        "created_at AS joinDate"
      ]);

    const response = (await db.query(query.toString())).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
