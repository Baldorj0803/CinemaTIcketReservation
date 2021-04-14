const Movie = require("../models/Movie");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/Error");
const path = require("path");
const paginate = require("../utils/paginate");
const Schedule = require("../models/Schedule");

//Одоо гарч буй
exports.getMoviesNow = asyncHandler(async (req, res) => {
	let start, end;
	if (req.query.startTime && req.query.endTime) {
		console.log("----------");
		let date1 = req.query.startTime.split("-").map((iNum) => parseInt(iNum));
		let date2 = req.query.endTime.split("-").map((iNum) => parseInt(iNum));

		if (date1.length < 5 || date2.length < 5)
			throw new Error("Сар өдөрөө оруулна уу", 400);

		start = new Date(
			Date.UTC(date1[0], date1[1] - 1, date1[2], date1[3], date1[4])
		);
		end = new Date(
			Date.UTC(date2[0], date2[1] - 1, date2[2], date2[3], date2[4])
		);
	} else {
		start = new Date();
		start.setHours(start.getHours() + 8);

		end = new Date(new Date(start));
		end.setHours(end.getHours() + 24);
	}

	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 3;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Movie);

	const movies = await Movie.nowPlaying(
		limit,
		pagination.start - 1,
		start,
		end
	);

	res.status(200).json({
		success: true,
		data: movies,
		pagination,
	});
});

//Удахгүй гарах
exports.getMoviesComingSoon = asyncHandler(async (req, res) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 3;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Movie);

	const movies = await Schedule.comingSoon(limit, pagination.start - 1);

	res.status(200).json({
		success: true,
		data: movies,
		pagination,
	});
});

exports.getMovies = asyncHandler(async (req, res, next) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 12;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Movie);

	const movies = await Movie.find(req.query, select)
		.sort(sort)
		.skip(pagination.start - 1)
		.limit(limit);

	res.status(200).json({
		success: true,
		data: movies,
		pagination,
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

//PUT:   api/v1/movie/:id/photo
exports.uploadMoviePhoto = asyncHandler(async (req, res, next) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	//image upload
	const file = req.files.file;

	if (!file.mimetype.startsWith("image")) {
		throw new MyError("Та зураг upload хийнэ үү", 400);
	}

	if (file.size > 1000000) {
		throw new MyError("Таны зурагны хэмжэ их байна", 400);
	}

	file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

	file.mv(`./public/upload/${file.name}`, (err) => {
		if (err) {
			throw new MyError("Файлыг хуулах явцад алдаа гарлаа" + err.message, 400);
		}
	});
	movie.photo = file.name;
	movie.save();

	res.status(200).json({
		success: true,
		data: file.name,
	});
});
