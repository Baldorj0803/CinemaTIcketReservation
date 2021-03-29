const express = require("express");
const router = express.Router();

const {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
} = require("../controller/categories");

const { getMovies } = require("../controller/movies");

// api/v1/categories/
router.route("/").get(getCategories).post(createCategory);

//1-р арга
// api/v1/categories/:id/movies
// router.route("/:categoryId/movies").get(getMovies);

//2-р арга
const moviesRooter = require("./movies");
router.use("/:categoryId/movies", moviesRooter);

router
	.route("/:id")
	.get(getCategory)
	.put(updateCategory)
	.delete(deleteCategory);

module.exports = router;
