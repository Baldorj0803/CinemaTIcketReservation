const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
const {
	getBranches,
	getBranch,
	createBranch,
	updateBranch,
	deleteBranch,
} = require("../controller/branches");

// api/v1/branchs
router
	.route("/")
	.get(getBranches)
	.post(protect, authorize("admin"), createBranch);
router
	.route("/:id")
	.get(getBranch)
	.put(protect, authorize("admin"), updateBranch)
	.delete(protect, authorize("admin"), deleteBranch);

module.exports = router;
