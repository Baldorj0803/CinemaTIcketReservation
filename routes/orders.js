const express = require("express");
const router = express.Router();

const {
	createOrder,
	getOrders,
	orderConfirm,
	deleteOrder,
	myoders,
} = require("../controller/orders");
const { authorize, protect } = require("../middleware/protect");

router
	.route("/")
	.post(protect, authorize("user"), createOrder)
	.get(protect, authorize("manager"), getOrders);
router.route("/:id").put(protect, orderConfirm).delete(protect, deleteOrder);
router.route("/user").get(protect, myoders);

module.exports = router;
