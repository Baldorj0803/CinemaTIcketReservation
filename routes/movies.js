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
	createMovieWithPhoto,
} = require("../controller/movies");

router
	.route("/")
	.get(getMovies)
	.post(protect, authorize("manager"), createMovieWithPhoto);
// .post(protect, authorize("manager"), createMovie);
router.route("/playing").get(getMoviesNow);
router.route("/coming-soon").get(getMoviesComingSoon);

router
	.route("/:id")
	.get(getMovie)
	.put(protect, authorize("manager"), updateMovie)
	.delete(protect, authorize("manager"), deleteMovie);

router.route("/:id/photo").put(uploadMoviePhoto);

module.exports = router;
