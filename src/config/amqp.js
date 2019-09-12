const amqp = require("amqplib");
const config = require(".");
const logger = require("./logger");

const {
  sendRegistrationEmail,
  sendVerificationEmail
} = require("../jobs/subscribers");

let conn = null;

const amqpConnection = async () => {
  try {
    if (!conn) {
      conn = await amqp.connect({
        hostname: config.rabbitmqHost || "localhost",
        port: config.rabbitmqPort || 5672,
        username: config.rabbitmqUser || "guest",
        password: config.rabbitmqPassword || "guest"
      });

      conn.on("error", err => {
        conn = null;
        if (err.message !== "Connection closing") {
          logger.error(err);
        }
      });

      conn.on("close", () => {
        conn = null;
        // setTimeout(amqpConnection, 1000);
        // console.error("[AMQP] reconnecting");
      });

      await Promise.all([
        sendRegistrationEmail(conn),
        sendVerificationEmail(conn)
      ]);
    }

    return conn;
  } catch (error) {
    logger.error(error);
  }
};

module.exports = amqpConnection;
