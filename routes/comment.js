const express = require("express");
const router = express.Router();

const {
	getComments,
	getComment,
	updateComment,
	deleteComment,
	createComment,
} = require("../controller/comments");

// api/v1/comments/
router.route("/").get(getComments).post(createComment);
router.route("/:id").get(getComment).put(updateComment).delete(deleteComment);

module.exports = router;
