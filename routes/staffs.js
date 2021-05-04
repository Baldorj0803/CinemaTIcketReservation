const express = require("express");
const router = express.Router();

const {
	getStaffs,
	getStaff,
	createStaff,
	updateStaff,
	deleteStaff,
} = require("../controller/staffs");
const { protect, authorize } = require("../middleware/protect");

router
	.route("/")
	.get(protect, authorize("admin"), getStaffs)
	.post(protect, authorize("admin"), createStaff);
router
	.route("/:id")
	.get(protect, getStaff)
	.put(protect, authorize("admin"), updateStaff)
	.delete(protect, authorize("admin"), deleteStaff);

module.exports = router;
