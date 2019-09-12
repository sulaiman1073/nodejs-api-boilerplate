// eslint-disable-next-line import/order
const config = require("./config");

if (config.mode !== "production") {
  require("./helpers/createProjectDirectories");
}
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const RedisStore = require("connect-redis");
const responseTime = require("response-time");

const requestId = require("./helpers/middleware/requestId");
const passport = require("./config/passport");
const logger = require("./config/logger");

const errorHandler = require("./helpers/middleware/errorHandler");
const requestLogger = require("./helpers/middleware/requestLogger");

let redis;

if (config.mode !== "testing") {
  redis = require("./config/redis");
  require("./config/amqp")();
}

const app = express();

if (config.mode === "development") {
  app.use(express.static("./public"));
}

app.set("trust proxy", "loopback");

if (config.mode === "production") {
  app.use(
    cors({
      origin(origin, cb) {
        const whitelist = config.corsOrigin ? config.corsOrigin.split(",") : [];
        if (whitelist.indexOf(origin) !== -1) {
          cb(null, true);
        } else {
          cb(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    })
  );
} else {
  app.use(cors());
}
app.use(responseTime());
app.use(requestId());

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
if (config.mode !== "testing") {
  app.use(
    session({
      name: config.sessionName || "S3SS10N",
      secret: config.sessionSecret || "S34KR1T",
      resave: true,
      saveUninitialized: false,
      store: new (RedisStore(session))({ client: redis })
    })
  );
}
if (config.mode === "production") {
  app.use(helmet());
}

app.use(passport.initialize());
app.use(passport.session());

if (config.mode !== "testing") {
  app.use(requestLogger);
}

app.use("/api", require("./api/"));

app.use(errorHandler);

let server;
if (config.mode !== "testing") {
  server = app.listen(config.port || 4000, config.host || "localhost", () => {
    logger.info(
      `Server is running at ${server.address().address}:${
        server.address().port
      } in ${app.get("env")} mode`
    );
  });
}
if (config.mode === "production") {
  require("./helpers/gracefulExit")(server);
}

module.exports = app;
