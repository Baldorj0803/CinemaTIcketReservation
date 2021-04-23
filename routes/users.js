const express = require("express");
const router = express.Router();
const {
	getUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
	loginUser,
} = require("../controller/user");
const { protect, authorize } = require("../middleware/protect");

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(protect, getUser).put(updateUser).delete(deleteUser);

// router.route("/login").post(loginUser);
module.exports = router;
