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

router.route("/").get(getStaffs).post(createStaff);
router
	.route("/:id")
	.get(protect, getStaff)
	.put(updateStaff)
	.delete(deleteStaff);

module.exports = router;
