const Movie = require("../models/Movie");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.getMovies = asyncHandler(async (req, res, next) => {
	//  api/v1/movies
	//  api/v1/categoires/:catId/movies
	let query;
	if (req.params.categoryId) {
		query = Movie.find({ movGenre: req.params.categoryId });
	} else {
		query = Movie.find().populate({ path: "movGenre", select: "name" });
	}

	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 100;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	//pagination
	// const total = await Movie.countDocuments();
	// const pageCount = Math.ceil(total / limit);
	// const start = (page - 1) * limit + 1;
	// let end = start + limit - 1;
	// if (end > total) end = total;

	// const pagination = { total, pageCount, start, end };

	// if (page < pageCount) pagination.nextPage = page + 1;
	// if (page > 1) pagination.prevPage = page - 1;

	// const movies = await Movie.find(req.query, select)
	// 	.sort(sort)
	// 	.skip(start - 1)
	// 	.limit(limit);

	const movies = await query;

	res.status(200).json({
		success: true,
		data: movies,
		// pagination,
	});
});

exports.getMovie = asyncHandler(async (req, res, next) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie) {
		throw new MyError(req.params.id + " ID-тэй кино байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: movie,
	});
});

exports.createMovie = asyncHandler(async (req, res, next) => {
	const movie = await Movie.create(req.body);

	res.status(200).json({
		success: true,
		data: movie,
	});
});

exports.updateMovie = asyncHandler(async (req, res, next) => {
	const movie = await Movie.findOneAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	res.status(200).json({
		success: true,
		data: movie,
	});
});

exports.deleteMovie = asyncHandler(async (req, res, next) => {
	const movie = await Movie.findByIdAndDelete(req.params.id);

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй кино устгагдлаа",
	});
});
