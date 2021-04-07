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

router.route("/").get(getSchedules).post(protect, createSchedule);

router
	.route("/:id")
	.get(getSchedule)
	.put(updateSchedule)
	.delete(deleteSchedule);

module.exports = router;
