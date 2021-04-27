const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");
const Error = require("../utils/Error");
const User = require("../models/User");
const Movie = require("../models/Movie");
function calcTime(city, offset) {
	// create Date object for current location
	var d = new Date();

	// convert to msec
	// subtract local time zone offset
	// get UTC time in msec
	var utc = d.getTime() + d.getTimezoneOffset() * 60000;

	// create new Date object for different city
	// using supplied offset
	var nd = new Date(utc + 3600000 * offset);

	// return time as a string
	// return "The local time for city" + city + " is " + nd.toLocaleString();
	return nd.toLocaleString();
}
function paginate(page, limit, total) {
	const pageCount = Math.ceil(total / limit);
	const start = (page - 1) * limit + 1;
	let end = start + limit - 1;
	if (end > total) end = total;

	const pagination = { total, pageCount, start, end };

	if (page < pageCount) pagination.nextPage = page + 1;
	if (page > 1) pagination.prevPage = page - 1;

	return pagination;
}
exports.getComments = asyncHandler(async (req, res, next) => {
	console.log(req.params.movieId);

	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 5;

	const total = await Comment.countDocuments({ movieId: req.params.movieId });
	const pagination = paginate(page, limit, total);
	const comments = await Comment.find({ movieId: req.params.movieId })
		.populate("userId", "name")
		.limit(limit)
		.sort({ writeDate: -1 })
		.skip(pagination.start - 1);

	res.status(200).json({
		success: true,
		data: comments,
		pagination,
	});
});

exports.getComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		throw new Error(req.params.id + " ID-тэй сэтгэгдэл байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: comment,
	});
});

exports.createComment = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.userId);

	if (!user) {
		throw new Error(req.userId + " ID-тай хэрэглэгч байхгүй байна", 400);
	}
	req.body.userId = req.userId;
	const movie = await Movie.findById(req.body.movieId);

	if (!movie) {
		throw new Error(req.body.movieId + " ID-тай кино байхгүй байна", 400);
	}
	// let current = new Date();
	// current.setHours(current.getHours() + 8);
	// req.body.writeDate = current;
	const comment = await Comment.create(req.body);
	comment.userId = user;

	res.status(200).json({
		success: true,
		data: comment,
	});
});

exports.updateComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!comment) {
		throw new MyError(req.params.id + " ID-тэй сэтгэгдэл байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: comment,
	});
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findByIdAndDelete(req.params.id);

	if (!comment) {
		throw new Error(req.params.id + " ID-тэй сэтгэгдэл байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй сэтгэгдэл устгагдлаа",
	});
});
