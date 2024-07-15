var router = require("express").Router();
const { celebrate, Joi, errors, Segments } = require("celebrate");

const {
  checkStatusSubscribeLpr,
  subscribeLpr,
  cancelSubscribeLpr,
} = require("../../controller/v1/access.controller");

router.get("/add-person", [
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }),
  }),
  checkStatusSubscribeLpr,
]);

module.exports = router;
