var router = require("express").Router();

const {
  checkStatusSubscribeLpr,
  subscribeLpr,
  cancelSubscribeLpr,
} = require("../../controller/v1/access.controller");

router.get("/check-status", checkStatusSubscribeLpr);
router.post("/subscript", subscribeLpr);
router.post("/cancel-subscript", cancelSubscribeLpr);

module.exports = router;
