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
router.use(protect);
router.route("/").get(getBranches).post( createBranch);
router.route("/:id").get(getBranch).put(updateBranch).delete(deleteBranch);

module.exports = router;
