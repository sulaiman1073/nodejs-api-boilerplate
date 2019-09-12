const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (db, { something, anotherThing }) => {
  try {
    const response = (await db.query(
      /* SQL */ `
    INSERT INTO
      example
        (
          something,
          anotherthing
        )
    VALUES
      ($1, $2)
    RETURNING
      id AS "id",
      something AS "something",
      anotherthing AS "anotherThing"`,
      [something, anotherThing]
    )).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
