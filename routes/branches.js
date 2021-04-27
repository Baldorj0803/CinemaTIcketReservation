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
router.route("/").get(getBranches).post(protect, createBranch);
router
	.route("/:id")
	.get(getBranch)
	.put(protect, updateBranch)
	.delete(protect, deleteBranch);

module.exports = router;
