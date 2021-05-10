const Movie = require("../models/Movie");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/Error");
const path = require("path");
const paginate = require("../utils/paginate");
const Schedule = require("../models/Schedule");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Rates = require("../models/Rates");
const mongoose = require("mongoose");

//Одоо гарч буй
exports.getMoviesNow = asyncHandler(async (req, res) => {
	let category;
	console.log(req.query);

	if (req.query.category && req.query.category !== "") {
		category = req.query.category.split(" ");
		console.log(category);
	} else {
		category = await Category.find().select("_id");
		console.log("Бүх категориор");
	}
	const search = req.query.search || "";
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
		end.setHours(end.getHours() + 48);
	}

	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 3;

	const total = await Movie.total(start, end, search);

	const pagination = paginate_movies(page, limit, total);

	const movies = await Movie.nowPlaying(
		limit,
		pagination.start - 1,
		start,
		end,
		search,
		category
	);

	res.status(200).json({
		success: true,
		data: movies,
		pagination,
	});
});

//Удахгүй гарах
exports.getMoviesComingSoon = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 3;

	let now = new Date();
	now.setHours(now.getHours() + 8);

	const total = await Schedule.aggregate([
		{
			$sort: { startTime: 1 },
		},
		{
			$group: {
				_id: "$movieId",
				count: {
					$sum: 1,
				},
				schedules: { $push: "$startTime" },
			},
		},
		{
			$project: {
				first: { $arrayElemAt: ["$schedules", 0] },
			},
		},
		{
			$match: {
				first: { $gte: now },
			},
		},
		{
			$group: {
				_id: null,
				total: {
					$sum: 1,
				},
			},
		},
	]);

	const pagination = await paginate_movies(page, limit, total[0].total);

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
		.populate("schedules")
		.sort({ movName: 1 })
		.skip(pagination.start - 1)
		.limit(limit);

	res.status(200).json({
		success: true,
		data: movies,
		pagination,
	});
});

exports.getMovie = asyncHandler(async (req, res, next) => {
	movieId = req.params.id || null;
	userId = req.query.userId || null;

	console.log(movieId, userId);

	let start = new Date();
	start.setHours(start.getHours() + 8);

	let end = new Date(new Date(start));
	end.setHours(end.getHours() + 48);
	const movie = await Movie.findById(req.params.id)
		.populate("movGenre")
		.populate({
			path: "schedules",
			select: { startTime: 1, branch: 1 },
			match: { startTime: { $gt: start, $lt: end } },
			options: { sort: { startTime: 1 } },
		});

	if (!movie) {
		throw new MyError(req.params.id + " ID-тэй кино байхгүй!", 400);
	}

	let rated = true;

	if (userId && userId !== null) {
		const order = await Order.aggregate([
			{
				$lookup: {
					from: "schedules",
					localField: "scheduleId",
					foreignField: "_id",
					as: "schedules",
				},
			},
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
					status: true,
					schedules: {
						$elemMatch: { movieId: new mongoose.Types.ObjectId(movieId) },
					},
				},
			},
		]);

		let ratedBefore = await Rates.countDocuments({
			movieId: new mongoose.Types.ObjectId(movieId),
			userId: new mongoose.Types.ObjectId(userId),
		});
		if (ratedBefore === 0 && order.length > 0) {
			rated = false;
		}
	}

	res.status(200).json({
		success: true,
		data: movie,
		rated,
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
	const movie = await Movie.findById(req.params.id);

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	let c = await orderedMovie(req.params.id);

	if (c > 0) {
		throw new MyError("Захиалагдсан кино устгах боломжгүй", 400);
	}

	movie.remove();

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй кино устгагдлаа",
	});
});

exports.createMovieWithPhoto = asyncHandler(async (req, res, next) => {
	console.log(req.body);
	console.log(req.files);
	const file = req.files.photo;

	if (!file.mimetype.startsWith("image")) {
		throw new MyError("Та зураг upload хийнэ үү", 400);
	}

	if (file.size > 1000000) {
		throw new MyError("Таны зурагны хэмжэ их байна", 400);
	}

	file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

	file.mv(`./public/upload/${file.name}`, (err) => {
		if (err) {
			throw new MyError("Файлыг хуулах явцад алдаа гарлаа" + err.message, 400);
		}
	});

	req.body.photo = file.name;

	const movie = await Movie.create(req.body);
	if (!movie) {
		throw new MyError("Алдаа гарлаа", 400);
	}

	res.status(200).json({
		success: true,
		data: movie,
	});
});

exports.updateMovie = asyncHandler(async (req, res, next) => {
	console.log(req.body);
	console.log(req.files);
	const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	if (req.files) {
		const file = req.files.photo;

		if (!file.mimetype.startsWith("image")) {
			throw new MyError("Та зураг upload хийнэ үү", 400);
		}

		if (file.size > 1000000) {
			throw new MyError("Таны зурагны хэмжэ их байна", 400);
		}

		file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

		file.mv(`./public/upload/${file.name}`, (err) => {
			if (err) {
				throw new MyError(
					"Файлыг хуулах явцад алдаа гарлаа" + err.message,
					400
				);
			}
		});
		movie.photo = file.name;
		movie.save();
	}

	res.status(200).json({
		success: true,
		data: movie,
	});
});
//PUT:   api/v1/movie/:id/photo
exports.uploadMoviePhoto = asyncHandler(async (req, res, next) => {
	console.log(req.file);
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

exports.rateMovie = asyncHandler(async (req, res, next) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie) {
		throw new MyError(req.params.id + " ID-тай кино байхгүй байна", 400);
	}

	if (!req.userId) {
		throw new MyError(req.params.id + " ID-тай хэрэглэгч байхгүй байна", 400);
	}

	const order = await Order.aggregate([
		{
			$lookup: {
				from: "schedules",
				localField: "scheduleId",
				foreignField: "_id",
				as: "schedules",
			},
		},
		{
			$match: {
				userId: new mongoose.Types.ObjectId(userId),
				status: true,
				schedules: {
					$elemMatch: { movieId: new mongoose.Types.ObjectId(movieId) },
				},
			},
		},
	]);

	if (!order || order.length < 1) {
		throw new MyError("Тасалбар захиалаагүй учир үнэлгээ өгөх боломжгүй", 400);
	}

	let ratedBefore = await Rates.countDocuments({
		movieId: new mongoose.Types.ObjectId(req.params.id),
		userId: new mongoose.Types.ObjectId(req.userId),
	});

	if (ratedBefore) {
		throw new MyError("Дахин үнэлгээ өгөх боломжгүй", 400);
	}

	var rate = {
		userId: req.userId,
		movieId: req.params.id,
		value: req.body.rating,
	};

	const result = await Rates.create(rate);

	movie.rateCount = movie.rateCount + 1;
	movie.rateValue = movie.rateValue + req.body.rating;

	const newRatedMovie = await movie.save();

	res.status(200).json({
		success: true,
		ratedMovie: newRatedMovie,
		rate: result,
	});
});

function paginate_movies(page, limit, total) {
	const pageCount = Math.ceil(total / limit);
	const start = (page - 1) * limit + 1;
	let end = start + limit - 1;
	if (end > total) end = total;

	const pagination = { total, pageCount, start, end };

	if (page < pageCount) pagination.nextPage = page + 1;
	if (page > 1) pagination.prevPage = page - 1;

	return pagination;
}

async function orderedMovie(movieId) {
	const ordered = await Order.aggregate([
		{
			$lookup: {
				from: "schedules",
				localField: "scheduleId",
				foreignField: "_id",
				as: "schedules",
			},
		},
		{
			$match: {
				status: true,
				schedules: {
					$elemMatch: { movieId: new mongoose.Types.ObjectId(movieId) },
				},
			},
		},
	]);
	return ordered.length;
}
