const router = require("express").Router();

router.use(require("./getExample"));
router.use(require("./addExample"));
router.use(require("./updateExample"));
router.use(require("./deleteExample"));

module.exports = router;
