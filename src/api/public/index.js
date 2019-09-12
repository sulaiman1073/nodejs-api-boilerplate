const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/sessions", require("./sessions"));
router.use("/example", require("./example"));

module.exports = router;
