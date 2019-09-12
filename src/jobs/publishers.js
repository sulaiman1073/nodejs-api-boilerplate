const conn = require("../config/amqp");
const { REGISTRATION_EMAIL, VERIFICATION_EMAIL } = require("./queues");

let channel = null;

const publish = async (queue, job) => {
  try {
    if (!channel) {
      channel = await (await conn()).createChannel();
      await channel.assertQueue(queue, { durable: true });

      channel.on("error", async err => {
        channel = null;
        await conn.close();
        console.error(err);
      });

      channel.on("close", () => {
        channel = null;
      });
    }

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(job)), {
      persistent: true
    });
  } catch (error) {
    console.error(error);
  }
};

const sendRegistrationEmail = async job => {
  await publish(REGISTRATION_EMAIL, job);
};

const sendVerificationEmail = async job => {
  await publish(VERIFICATION_EMAIL, job);
};

module.exports = { sendRegistrationEmail, sendVerificationEmail };
