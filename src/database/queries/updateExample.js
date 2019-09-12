const knex = require("../../config/knex");
const createDatabaseError = require("../../helpers/createDatabaseError");

module.exports = async (db, { id, something, anotherThing }) => {
  try {
    const query = knex
      .update({
        something,
        anotherthing: anotherThing,
        updated_at: knex.raw("NOW()")
      })
      .from("example")
      .where("id", id)
      .andWhere("deleted", false)
      .returning(["id", "something", "anotherthing AS anotherThing"]);

    const response = (await db.query(query.toString())).rows[0];

    if (!response) return null;

    return response;
  } catch (error) {
    throw createDatabaseError(error);
  }
};
