const express = require("express");
const router = express.Router();

const {
	getSchedules,
	getSchedule,
	createSchedule,
	deleteSchedule,
	updateSchedule,
} = require("../controller/schedules");
const { protect, authorize } = require("../middleware/protect");

router
	.route("/")
	.get(protect, authorize("manager"), getSchedules)
	.post(protect, createSchedule);

router
	.route("/:id")
	.get(getSchedule)
	.put(protect, authorize("manager"), updateSchedule)
	.delete(protect, authorize("manager"), deleteSchedule);

module.exports = router;
