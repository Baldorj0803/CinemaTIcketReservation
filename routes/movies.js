const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/protect");

const {
	getMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
} = require("../controller/movies");

router.route("/").get(getMovies).post(protect, authorize("staff"), createMovie);

router
	.route("/:id")
	.get(getMovie)
	.put(protect, authorize("staff"), updateMovie)
	.delete(protect, authorize("staff"), deleteMovie);

module.exports = router;
