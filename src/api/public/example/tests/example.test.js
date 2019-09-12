const request = require("supertest");
const app = require("../../../../index");
const redis = require("../../../../config/redis");
const resetDb = require("../../../../helpers/resetDb");
const closeAllConnections = require("../../../../helpers/closeAllConnections");

describe("example API tests", () => {
  let server;

  beforeAll(async () => {
    server = await request(app);
  });

  beforeEach(async () => {
    await resetDb();
    await redis.flushall();
  });

  afterEach(async () => {
    await resetDb();
    await redis.flushall();
  });

  afterAll(async () => {
    await closeAllConnections();
  });

  it("should add, get, update and delete example", async () => {
    const newExample = {
      something: "xxx",
      anotherThing: "yyy"
    };

    const addedExample = await server.post("/api/example").send(newExample);

    expect(addedExample.status).toBe(201);
    expect(addedExample.type).toBe("application/json");
    expect(addedExample.headers.location).toBe("/api/example/1");
    expect({
      something: addedExample.body.something,
      anotherThing: addedExample.body.anotherThing
    }).toEqual(newExample);

    const exampleId = addedExample.body.id;

    const gotExample = await server.get(`/api/example/${exampleId}`);

    expect(gotExample.status).toBe(200);
    expect(gotExample.type).toBe("application/json");
    expect(gotExample.body).toEqual(addedExample.body);

    const updatedInfo = {
      something: "xxx123",
      anotherThing: "yyy321"
    };

    const updatedExample = await server
      .put(`/api/example/${exampleId}`)
      .send(updatedInfo);

    expect(updatedExample.status).toBe(200);
    expect(updatedExample.type).toBe("application/json");
    expect(updatedExample.body).toEqual({
      id: exampleId,
      ...updatedInfo
    });

    const deletedExample = await server.delete(`/api/example/${exampleId}`);

    expect(deletedExample.status).toBe(204);

    const gotExample2 = await server.get(`/api/example/${exampleId}`);

    expect(gotExample2.status).toBe(404);
    expect(gotExample2.type).toBe("application/json");

    expect(gotExample2.body).toEqual({
      code: 404,
      error: "Not Found",
      message: "Example with id of 1 not found"
    });
  });
});
