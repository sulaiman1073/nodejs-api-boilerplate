const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (
  db,
  {
    firstName,
    lastName,
    username,
    email,
    hashedPassword: password,
    dateOfBirth
  }
) => {
  try {
    const response = (await db.query(
      /* SQL */ `
    INSERT INTO
      users
        (
          first_name,
          last_name,
          username,
          email,
          password,
          date_of_birth
        )
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING
      id AS "id",
      first_name AS "firstName",
      last_name AS "lastName",
      username AS "username",
      email AS "email",
      date_of_birth AS "dateOfBirth",
      avatar AS "avatar",
      email_verified AS "emailVerified",
      created_at AS "joinDate"`,
      [firstName, lastName, username, email, password, dateOfBirth]
    )).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
