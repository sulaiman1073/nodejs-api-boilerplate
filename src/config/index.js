const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../../.env") });

module.exports = {
  mode: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  corsOrigin: process.env.CORS_ORIGIN,
  logsPathDev: resolve(process.cwd(), "./logs/"),
  uploadsPathDev: resolve(process.cwd(), "./public/uploads/"),
  uploadsPath: process.env.UPLOADS_PATH,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisIndex: process.env.REDIS_DATABASE,
  redisPassword: process.env.REDIS_PASSWORD,
  rabbitmqHost: process.env.RABBITMQ_HOST,
  rabbitmqPort: process.env.RABBITMQ_PORT,
  rabbitmqUser: process.env.RABBITMQ_USER,
  rabbitmqPassword: process.env.RABBITMQ_PASSWORD,
  sessionName: process.env.SESSION_NAME,
  sessionSecret: process.env.SESSION_SECRET,
  benchmark: process.env.BENCHMARK
};
