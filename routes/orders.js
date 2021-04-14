const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controller/orders");
const { authorize, protect } = require("../middleware/protect");

router.route("/").post(protect, authorize("user"), createOrder).get(getOrders);

module.exports = router;
