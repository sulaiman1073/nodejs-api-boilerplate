const database = require("../../../config/database");
const resetDb = require("../../../helpers/resetDb");
const closeAllConnections = require("../../../helpers/closeAllConnections");
const addExample = require("../addExample");
const getExample = require("../getExample");
const updateExample = require("../updateExample");
const deleteExample = require("../deleteExample");

describe("Example tests", () => {
  let client;

  beforeEach(async () => {
    await resetDb();
    client = await database.connect();
  });

  afterEach(async () => {
    await resetDb();
    await client.release();
  });

  afterAll(async () => {
    await closeAllConnections();
  });

  it("should add, get, update and delete example", async () => {
    const newExample = {
      something: "abc",
      anotherThing: "xyz"
    };

    const addedExample = await addExample(client, newExample);

    expect({
      something: addedExample.something,
      anotherThing: addedExample.anotherThing
    }).toEqual(newExample);

    const gotExample = await getExample(client, { id: addedExample.id });

    expect(gotExample).toEqual(addedExample);

    const updatedInfo = { something: "abc123", anotherThing: "xyz321" };

    const updatedExample = await updateExample(client, {
      ...updatedInfo,
      id: gotExample.id
    });

    expect(updatedExample).toEqual({
      ...updatedInfo,
      id: gotExample.id
    });

    const exampleDeleted = await deleteExample(client, { id: gotExample.id });

    expect(exampleDeleted).toBeTruthy();

    const gotDeletedExample = await getExample(client, { id: addedExample.id });

    expect(gotDeletedExample).toBeNull();
  });
});
