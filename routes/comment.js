const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
	getComments,
	getComment,
	updateComment,
	deleteComment,
	createComment,
} = require("../controller/comments");

// api/v1/comments/
router.route("/").post(protect, createComment);
router.route("/movie/:movieId").get(getComments);
router
	.route("/:id")
	.get(getComment)
	.put(updateComment)
	.delete(protect, deleteComment);

module.exports = router;
