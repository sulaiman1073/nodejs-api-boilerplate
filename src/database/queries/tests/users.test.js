const database = require("../../../config/database");
const resetDb = require("../../../helpers/resetDb");
const closeAllConnections = require("../../../helpers/closeAllConnections");
const addUser = require("../addUser");
const getUser = require("../getUser");
const updateUser = require("../updateUser");
const getEmailVerificationToken = require("../getEmailVerificationToken");
const verifyEmail = require("../verifyEmail");

describe("User tests", () => {
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

  it("should add user, get user, update user and verify email", async () => {
    const newUser = {
      firstName: "abc",
      lastName: "xyz",
      username: "user",
      email: "email@gmail.com",
      hashedPassword: "password",
      dateOfBirth: "1970-01-01"
    };

    const addedUser = await addUser(client, newUser);

    const verificationToken = await getEmailVerificationToken(client, {
      id: addedUser.id
    });

    expect({
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      email: newUser.email,
      avatar: null,
      emailVerified: false
    }).toEqual({
      firstName: addedUser.firstName,
      lastName: addedUser.lastName,
      username: addedUser.username,
      email: addedUser.email,
      avatar: null,
      emailVerified: false
    });

    expect(verificationToken).not.toBeUndefined();

    const gotUser = await getUser(client, {
      id: addedUser.id,
      withPassword: true
    });

    expect(gotUser).toEqual({
      ...addedUser,
      password: newUser.hashedPassword
    });

    let updatedInfo = {
      email: "email123@gmail.com",
      hashedPassword: "password123",
      avatar: "avatar"
    };

    const updatedUser = await updateUser(client, {
      id: addedUser.id,
      ...updatedInfo
    });

    updatedInfo = {
      email: "email123@gmail.com",
      avatar: "avatar"
    };

    expect(updatedUser).toEqual({
      ...addedUser,
      ...updatedInfo
    });

    const verifiedUser = await verifyEmail(client, {
      email: updatedUser.email,
      verificationToken
    });

    expect(verifiedUser).toEqual({
      ...updatedUser,
      emailVerified: true
    });
  });
});
