const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (db, { id }) => {
  try {
    const response = (await db.query(
      /* SQL */ `
    SELECT
      example.id AS "id",
      example.something AS "something",
      example.anotherthing AS "anotherThing"
    FROM
      example
    WHERE
      example.id = $1
      AND example.deleted = FALSE`,
      [id]
    )).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
