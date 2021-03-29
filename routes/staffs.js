const express = require("express");
const router = express.Router();

const {
	getStaffs,
	getStaff,
	createStaff,
	updateStaff,
	deleteStaff,
} = require("../controller/staffs");

router.route("/").get(getStaffs).post(createStaff);
router.route("/:id").get(getStaff).put(updateStaff).delete(deleteStaff);

module.exports = router;
