var router = require("express").Router();

const {
  checkStatusSubscribeLpr,
  subscribeLpr,
  cancelSubscribeLpr,
} = require("../controller/access.controller");

router.get("/check-status-lpr", checkStatusSubscribeLpr);
router.post("/subscript-lpr", subscribeLpr);
router.post("/cancel-subscript-lpr", cancelSubscribeLpr);

module.exports = router;
