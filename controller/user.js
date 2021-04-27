const User = require("../models/User");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Staff = require("../models/Staff");

exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		success: true,
		data: users,
	});
});

exports.getUser = asyncHandler(async (req, res, next) => {
	if (req.userId !== req.params.id) {
		throw new Error("Хэрэглэгч байхгүй!", 400);
	}

	const user = await User.findById(req.params.id);

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

//register
exports.createUser = asyncHandler(async (req, res, next) => {
	const staff = await Staff.find({ email: req.body.email });

	if (staff.length !== 0) {
		throw new Error("Имэйл бүртгэгдсэн байна", 400);
	}

	const user = await User.create(req.body);

	const token = user.getJsonWebToken();

	if (user.password) user.password = null;

	res.status(200).json({
		success: true,
		token,
		data: user,
	});
});

exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй хэрэглэгч устгагдлаа",
	});
});
