const { REGISTRATION_EMAIL, VERIFICATION_EMAIL } = require("./queues");
const sendRegistrationEmailWork = require("./work/sendRegistrationEmail");
const sendVerificationEmailWork = require("./work/sendVerificationEmail");

let channel;

const subscribe = async (conn, queue, work) => {
  try {
    channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });
    await channel.prefetch(1);
    await channel.consume(
      queue,
      async msg => {
        const job = JSON.parse(msg.content.toString());
        await work(job);
        await channel.ack(msg);
      },
      { noAck: false }
    );

    channel.on("close", () => {
      channel = null;
    });

    channel.on("error", async err => {
      await conn.close();
      console.error(err);
    });
  } catch (error) {
    console.error(error);
  }
};

const sendRegistrationEmail = async conn => {
  await subscribe(conn, REGISTRATION_EMAIL, sendRegistrationEmailWork);
};

const sendVerificationEmail = async conn => {
  await subscribe(conn, VERIFICATION_EMAIL, sendVerificationEmailWork);
};

module.exports = { sendRegistrationEmail, sendVerificationEmail };
