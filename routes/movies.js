const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/protect");

const {
	getMovies,
	getMovie,
	createMovie,
	updateMovie,
	deleteMovie,
	uploadMoviePhoto,
	getMoviesNow,
	getMoviesComingSoon,
} = require("../controller/movies");

router.route("/").get(getMovies).post(protect, authorize("staff"), createMovie);
router.route("/playing").get(getMoviesNow);
router.route("/coming-soon").get(getMoviesComingSoon);

router
	.route("/:id")
	.get(getMovie)
	.put(protect, authorize("staff"), updateMovie)
	.delete(protect, authorize("staff"), deleteMovie);

router.route("/:id/photo").put(uploadMoviePhoto);

module.exports = router;
