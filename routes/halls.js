const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
	getHalls,
	getHall,
	createHall,
	updateHall,
	deleteHall,
} = require("../controller/halls");

// api/v1/halls
router.route("/").get(getHalls).post(protect, authorize("admin"), createHall);

//  api/v1/hall/:id
router
	.route("/:id")
	.get(getHall)
	.put(protect, authorize("admin"), updateHall)
	.delete(protect, authorize("admin"), deleteHall);

module.exports = router;
