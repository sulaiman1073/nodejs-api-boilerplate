const faker = require("faker");
const allSettled = require("promise.allsettled");
const bcrypt = require("bcryptjs");
const { format, parse } = require("date-fns");
const database = require("../../config/database");
const logger = require("../../config/logger");

async function seedDb() {
  logger.debug("Seeding database...");

  const client = await database.connect();

  try {
    const examplesSeed = Array.from({ length: 10000 }).map(() => ({
      something: faker.name.firstName(),
      anotherThing: faker.name.lastName()
    }));

    await allSettled(
      examplesSeed.map(example =>
        client.query(
          /* SQL */ `
        INSERT INTO
          example
          (
            something,
            anotherthing
          )
        VALUES
          ($1, $2)`,
          [example.something, example.anotherThing]
        )
      )
    );

    const hashedPassword = await bcrypt.hash("password", 10);

    const usersSeed = Array.from({ length: 2000 }).map(() => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      dateOfBirth: format(
        parse(faker.date.between("1950-01-01", "2000-01-01")),
        "YYYY-MM-DD"
      ),
      avatar: faker.image.avatar()
    }));

    await allSettled(
      usersSeed.map(user =>
        client.query(
          /* SQL */ `
        INSERT INTO
          users
          (
            first_name,
            last_name,
            username,
            email,
            password,
            date_of_birth,
            avatar
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)`,
          [
            user.firstName,
            user.lastName,
            user.username,
            user.email,
            hashedPassword,
            user.dateOfBirth,
            user.avatar
          ]
        )
      )
    );

    logger.debug("Seeded database.");
  } catch (error) {
    logger.error(error);
  } finally {
    await client.release();
    await database.end();
  }
}

seedDb();
