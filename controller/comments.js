const Comment = require("../models/Comment");
const asyncHandler = require("express-async-handler");
const Error = require("../utils/Error");
const User = require("../models/User");
const Movie = require("../models/Movie");

exports.getComments = asyncHandler(async (req, res, next) => {
	const comments = await Comment.find();

	res.status(200).json({
		success: true,
		data: comments,
	});
});

exports.getComment = asyncHandler(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id);

	if (!comment) {
		throw new MyError(req.params.id + " ID-тэй сэтгэгдэл байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: comment,
	});
});

exports.createComment = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.body.userId);

	if (!user) {
		throw new Error(req.body.userId + " ID-тай хэрэглэгч байхгүй байна", 400);
	}

	const movie = await Movie.findById(req.body.movieId);

	if (!movie) {
		throw new Error(req.body.movieId + " ID-тай кино байхгүй байна", 400);
	}

	const comment = await Comment.create(req.body);

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
		throw new MyError(req.params.id + " ID-тэй сэтгэгдэл байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй сэтгэгдэл устгагдлаа",
	});
});
