const express = require("express");
const router = express.Router({ mergeParams: true });

const {
	getMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
} = require("../controller/movies");

router.route("/").get(getMovies).post(createMovie);

router.route("/:id").get(getMovie).put(updateMovie).delete(deleteMovie);

module.exports = router;
