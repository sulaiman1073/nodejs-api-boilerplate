const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (db, { id }) => {
  try {
    const response = (await db.query(
      /* SQL */ `
    UPDATE
      example
    SET
      deleted = TRUE,
      updated_at = NOW()
    WHERE
      id = $1
      AND deleted = false
    RETURNING
      id`,
      [id]
    )).rows[0];

    return Boolean(response);
  } catch (error) {
    throw createDatabaseError(error);
  }
};
