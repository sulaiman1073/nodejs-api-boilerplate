const knex = require("../../config/knex");
const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (
  db,
  { id, username, email, usernameOrEmail, withPassword }
) => {
  try {
    const query = knex
      .select("id")
      .select("first_name AS firstName")
      .select("last_name AS lastName")
      .select("username")
      .select("email")
      .select("date_of_birth AS dateOfBirth")
      .select("avatar AS avatar")
      .select("email_verified AS emailVerified")
      .select("created_at AS joinDate")
      .from("users")
      .where("deleted", false);

    if (usernameOrEmail) {
      query.whereRaw(
        /* SQL */ `
        username = ?
        OR email = ?
        `,
        [usernameOrEmail, usernameOrEmail]
      );
    } else if (id) {
      query.where("id", id);
    } else if (username) {
      query.where("username", username);
    } else if (email) {
      query.where("email", email);
    }

    if (withPassword) {
      query.select("password");
    }

    const response = (await db.query(query.toString())).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
